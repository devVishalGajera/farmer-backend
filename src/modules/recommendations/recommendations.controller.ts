import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { RecommendationsService } from './recommendations.service';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Crop recommendation endpoints
 */
export class RecommendationsController extends BaseController {
  private recommendationsService: RecommendationsService;

  constructor() {
    super();
    this.recommendationsService = new RecommendationsService();
  }

  /**
   * @swagger
   * /api/v1/recommendations:
   *   get:
   *     summary: Get crop recommendation
   *     tags: [Recommendations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: cropId
   *         required: true
   *         schema:
   *           type: string
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
   *     responses:
   *       200:
   *         description: Recommendation retrieved successfully
   */
  getRecommendation = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.query as any;
    const recommendation = await this.recommendationsService.getRecommendation(dto);
    return this.success(res, 'Recommendation retrieved successfully', recommendation);
  });
}

