import { Router } from 'express';
import { WeatherController } from './weather.controller';

const router = Router();
const weatherController = new WeatherController();

// Weather forecast accepts optional query parameters, no strict validation needed
router.get('/forecast', weatherController.getForecast);

export default router;

