import { prisma, SuitabilityLevel } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException } from '../../common/exceptions/app-exception';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';
import { WeatherService } from '../weather/weather.service';

export interface RecommendationResult {
  suitability: SuitabilityLevel;
  score: number; // 0-100
  explanation: string;
  factors: {
    area: string;
    weather: string;
    cropRequirements: string;
  };
}

export class RecommendationsService extends BaseService {
  private weatherService: WeatherService;

  constructor() {
    super();
    this.weatherService = new WeatherService();
  }

  /**
   * Get crop recommendation based on area and weather
   * Rule-based, not AI
   */
  async getRecommendation(dto: RecommendationQueryDto): Promise<RecommendationResult> {
    // Get crop details
    const crop = await prisma.crop.findUnique({
      where: { id: dto.cropId },
      include: {
        suitabilityRules: {
          where: { isActive: true },
        },
      },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    // Get area suitability
    const areaSuitability = await this.checkAreaSuitability(crop.id, dto.stateId, dto.districtId);

    // Get weather data
    const weatherData = dto.stateId || dto.districtId || dto.villageId
      ? await this.weatherService.getWeatherForecast({
          stateId: dto.stateId,
          districtId: dto.districtId,
          villageId: dto.villageId,
        })
      : null;

    // Check weather suitability
    const weatherSuitability = this.checkWeatherSuitability(crop, weatherData);

    // Calculate overall suitability
    const result = this.calculateSuitability(areaSuitability, weatherSuitability, crop);

    return result;
  }

  private async checkAreaSuitability(
    cropId: string,
    stateId?: string,
    districtId?: string
  ): Promise<{ level: SuitabilityLevel; explanation: string }> {
    // Check for specific suitability rules
    if (stateId) {
      const rule = await prisma.cropSuitability.findFirst({
        where: {
          cropId,
          stateId,
          isActive: true,
        },
      });

      if (rule) {
        return {
          level: rule.suitability,
          explanation: rule.explanation,
        };
      }
    }

    if (districtId) {
      const rule = await prisma.cropSuitability.findFirst({
        where: {
          cropId,
          districtId,
          isActive: true,
        },
      });

      if (rule) {
        return {
          level: rule.suitability,
          explanation: rule.explanation,
        };
      }
    }

    // Default to medium if no specific rule
    return {
      level: SuitabilityLevel.MEDIUM,
      explanation: 'No specific area suitability data available',
    };
  }

  private checkWeatherSuitability(
    crop: any,
    weatherData: any
  ): { level: SuitabilityLevel; explanation: string } {
    if (!weatherData || !weatherData.current) {
      return {
        level: SuitabilityLevel.MEDIUM,
        explanation: 'Weather data not available',
      };
    }

    const current = weatherData.current;
    const factors: string[] = [];

    // Check temperature
    if (crop.minTemperature && crop.maxTemperature) {
      if (current.temperature < crop.minTemperature || current.temperature > crop.maxTemperature) {
        factors.push(`Temperature (${current.temperature}°C) is outside optimal range (${crop.minTemperature}-${crop.maxTemperature}°C)`);
        return {
          level: SuitabilityLevel.LOW,
          explanation: factors.join('. '),
        };
      } else {
        factors.push(`Temperature (${current.temperature}°C) is within optimal range`);
      }
    }

    // Check rainfall (if available in forecast)
    if (weatherData.forecast && weatherData.forecast.length > 0) {
      const avgRainfall = weatherData.forecast.reduce((sum: number, day: any) => sum + (day.rainfall || 0), 0) / weatherData.forecast.length;
      
      if (crop.minRainfall && crop.maxRainfall) {
        if (avgRainfall < crop.minRainfall || avgRainfall > crop.maxRainfall) {
          factors.push(`Expected rainfall (${avgRainfall.toFixed(1)}mm) is outside optimal range (${crop.minRainfall}-${crop.maxRainfall}mm)`);
          return {
            level: SuitabilityLevel.MEDIUM,
            explanation: factors.join('. '),
          };
        } else {
          factors.push(`Expected rainfall (${avgRainfall.toFixed(1)}mm) is within optimal range`);
        }
      }
    }

    return {
      level: SuitabilityLevel.HIGH,
      explanation: factors.length > 0 ? factors.join('. ') : 'Weather conditions are suitable for this crop',
    };
  }

  private calculateSuitability(
    areaSuitability: { level: SuitabilityLevel; explanation: string },
    weatherSuitability: { level: SuitabilityLevel; explanation: string },
    crop: any
  ): RecommendationResult {
    // Combine suitability levels
    const levels = [areaSuitability.level, weatherSuitability.level];
    
    // Calculate overall suitability
    let overallLevel: SuitabilityLevel;
    let score: number;

    if (levels.includes(SuitabilityLevel.LOW)) {
      overallLevel = SuitabilityLevel.LOW;
      score = 30;
    } else if (levels.every(l => l === SuitabilityLevel.HIGH)) {
      overallLevel = SuitabilityLevel.HIGH;
      score = 90;
    } else {
      overallLevel = SuitabilityLevel.MEDIUM;
      score = 60;
    }

    const explanation = `Area suitability: ${areaSuitability.explanation}. Weather suitability: ${weatherSuitability.explanation}`;

    return {
      suitability: overallLevel,
      score,
      explanation,
      factors: {
        area: areaSuitability.explanation,
        weather: weatherSuitability.explanation,
        cropRequirements: `Optimal temperature: ${crop.minTemperature || 'N/A'}-${crop.maxTemperature || 'N/A'}°C, Rainfall: ${crop.minRainfall || 'N/A'}-${crop.maxRainfall || 'N/A'}mm`,
      },
    };
  }
}

