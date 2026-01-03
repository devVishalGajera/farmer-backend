import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { MarketService } from './market.service';
import { CreateMarketPriceDto, UpdateMarketPriceDto } from './dto/create-price.dto';

/**
 * @swagger
 * tags:
 *   name: Market Prices
 *   description: Market price endpoints
 */
export class MarketController extends BaseController {
  private marketService: MarketService;

  constructor() {
    super();
    this.marketService = new MarketService();
  }

  getPrices = this.asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      cropId: req.query.cropId as string | undefined,
      stateId: req.query.stateId as string | undefined,
      districtId: req.query.districtId as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const prices = await this.marketService.getPrices(filters);
    return this.success(res, 'Market prices retrieved successfully', prices);
  });

  getPriceById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const price = await this.marketService.getPriceById(id);
    return this.success(res, 'Market price retrieved successfully', price);
  });

  createPrice = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as CreateMarketPriceDto;
    const price = await this.marketService.createPrice(dto);
    return this.success(res, 'Market price created successfully', price, 201);
  });

  updatePrice = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body as UpdateMarketPriceDto;
    const price = await this.marketService.updatePrice(id, dto);
    return this.success(res, 'Market price updated successfully', price);
  });

  deletePrice = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.marketService.deletePrice(id);
    return this.success(res, 'Market price deleted successfully');
  });
}

