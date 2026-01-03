import { Router } from 'express';
import { RecommendationsController } from './recommendations.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const recommendationsController = new RecommendationsController();

// Recommendation accepts query parameters, validation handled in controller
router.get('/', jwtGuard, recommendationsController.getRecommendation);

export default router;

