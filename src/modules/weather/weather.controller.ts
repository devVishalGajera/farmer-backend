import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Weather information endpoints
 */
export class WeatherController extends BaseController {
  private weatherService: WeatherService;

  constructor() {
    super();
    this.weatherService = new WeatherService();
  }

  /**
   * @swagger
   * /api/v1/weather/forecast:
   *   get:
   *     summary: Get weather forecast (7-10 days)
   *     tags: [Weather]
   *     parameters:
   *       - in: query
   *         name: stateId
   *         schema:
   *           type: string
   *       - in: query
   *         name: districtId
   *         schema:
   *           type: string
   *       - in: query
   *         name: villageId
   *         schema:
   *           type: string
   *       - in: query
   *         name: latitude
   *         schema:
   *           type: number
   *       - in: query
   *         name: longitude
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Weather forecast retrieved successfully
   */
  getForecast = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.query as any;
    const forecast = await this.weatherService.getWeatherForecast(dto);
    return this.success(res, 'Weather forecast retrieved successfully', forecast);
  });
}

