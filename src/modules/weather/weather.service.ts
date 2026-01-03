import axios from 'axios';
import { prisma } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException, InternalServerException } from '../../common/exceptions/app-exception';
import { config } from '../../config/env';
import { WeatherQueryDto } from './dto/weather-query.dto';

interface WeatherApiResponse {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
  };
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    humidity: number;
    pressure: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
    }>;
    rain?: number;
  }>;
}

export class WeatherService extends BaseService {
  /**
   * Get weather forecast (7-10 days)
   * Uses cache if available and not expired
   */
  async getWeatherForecast(dto: WeatherQueryDto) {
    // Try to get from cache first
    const cacheKey = this.getCacheKey(dto);
    const cached = await this.getCachedWeather(cacheKey);

    if (cached && cached.expiresAt > new Date()) {
      return cached.data;
    }

    // Get coordinates
    const coordinates = await this.getCoordinates(dto);
    if (!coordinates) {
      throw new NotFoundException('Location not found');
    }

    // Fetch from external API
    const weatherData = await this.fetchWeatherFromAPI(coordinates.lat, coordinates.lon);

    // Cache the result
    await this.cacheWeather(cacheKey, coordinates, weatherData);

    return weatherData;
  }

  private async getCoordinates(dto: WeatherQueryDto): Promise<{ lat: number; lon: number } | null> {
    // If lat/lon provided, use them
    if (dto.latitude && dto.longitude) {
      return { lat: dto.latitude, lon: dto.longitude };
    }

    // Otherwise, try to get from area hierarchy
    if (dto.villageId) {
      const village = await prisma.village.findUnique({
        where: { id: dto.villageId },
        include: {
          district: {
            include: {
              state: true,
            },
          },
        },
      });

      if (village) {
        // For now, return default coordinates (in production, store lat/lon in database)
        // This is a placeholder - you should add lat/lon to State/District/Village models
        return { lat: 20.5937, lon: 78.9629 }; // Default to India center
      }
    }

    if (dto.districtId) {
      const district = await prisma.district.findUnique({
        where: { id: dto.districtId },
      });

      if (district) {
        return { lat: 20.5937, lon: 78.9629 };
      }
    }

    if (dto.stateId) {
      const state = await prisma.state.findUnique({
        where: { id: dto.stateId },
      });

      if (state) {
        return { lat: 20.5937, lon: 78.9629 };
      }
    }

    return null;
  }

  private async fetchWeatherFromAPI(lat: number, lon: number): Promise<any> {
    try {
      const apiKey = config.weather.apiKey;
      if (!apiKey) {
        throw new InternalServerException('Weather API key not configured');
      }

      const url = `${config.weather.apiUrl}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
      const response = await axios.get<WeatherApiResponse>(url);

      // Transform to our format
      return {
        location: {
          lat: response.data.lat,
          lon: response.data.lon,
          timezone: response.data.timezone,
        },
        current: {
          temperature: response.data.current.temp,
          feelsLike: response.data.current.feels_like,
          humidity: response.data.current.humidity,
          pressure: response.data.current.pressure,
          windSpeed: response.data.current.wind_speed,
          condition: response.data.current.weather[0]?.main,
          description: response.data.current.weather[0]?.description,
        },
        forecast: response.data.daily.slice(0, 7).map((day) => ({
          date: new Date(day.dt * 1000).toISOString(),
          minTemp: day.temp.min,
          maxTemp: day.temp.max,
          humidity: day.humidity,
          pressure: day.pressure,
          windSpeed: day.wind_speed,
          condition: day.weather[0]?.main,
          description: day.weather[0]?.description,
          rainfall: day.rain || 0,
        })),
      };
    } catch (error: any) {
      if (error.response) {
        throw new InternalServerException(`Weather API error: ${error.response.data?.message || error.message}`);
      }
      throw new InternalServerException('Failed to fetch weather data');
    }
  }

  private getCacheKey(dto: WeatherQueryDto): string {
    if (dto.latitude && dto.longitude) {
      return `lat_${dto.latitude}_lon_${dto.longitude}`;
    }
    if (dto.villageId) return `village_${dto.villageId}`;
    if (dto.districtId) return `district_${dto.districtId}`;
    if (dto.stateId) return `state_${dto.stateId}`;
    return 'default';
  }

  private async getCachedWeather(cacheKey: string): Promise<{ data: any; expiresAt: Date } | null> {
    // Find cache by location identifiers
    const cache = await prisma.weatherCache.findFirst({
      where: {
        OR: [
          { villageId: cacheKey.includes('village_') ? cacheKey.replace('village_', '') : undefined },
          { districtId: cacheKey.includes('district_') ? cacheKey.replace('district_', '') : undefined },
          { stateId: cacheKey.includes('state_') ? cacheKey.replace('state_', '') : undefined },
        ],
      },
      orderBy: { cachedAt: 'desc' },
    });

    if (cache && cache.expiresAt > new Date()) {
      return {
        data: cache.data as any,
        expiresAt: cache.expiresAt,
      };
    }

    return null;
  }

  private async cacheWeather(cacheKey: string, coordinates: { lat: number; lon: number }, data: any): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Cache for 24 hours

    // Extract location IDs from cache key
    const villageId = cacheKey.includes('village_') ? cacheKey.replace('village_', '') : null;
    const districtId = cacheKey.includes('district_') ? cacheKey.replace('district_', '') : null;
    const stateId = cacheKey.includes('state_') ? cacheKey.replace('state_', '') : null;

    await prisma.weatherCache.create({
      data: {
        stateId: stateId || undefined,
        districtId: districtId || undefined,
        villageId: villageId || undefined,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        data: data as any,
        expiresAt,
      },
    });
  }
}

