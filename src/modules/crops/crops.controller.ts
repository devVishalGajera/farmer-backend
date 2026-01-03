import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { CropsService } from './crops.service';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';

/**
 * @swagger
 * tags:
 *   name: Crops
 *   description: Crop management endpoints
 */
export class CropsController extends BaseController {
  private cropsService: CropsService;

  constructor() {
    super();
    this.cropsService = new CropsService();
  }

  getAllCrops = this.asyncHandler(async (req: Request, res: Response) => {
    const activeOnly = req.query.activeOnly === 'true';
    const crops = await this.cropsService.getAllCrops(activeOnly);
    return this.success(res, 'Crops retrieved successfully', crops);
  });

  getCropById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const crop = await this.cropsService.getCropById(id);
    return this.success(res, 'Crop retrieved successfully', crop);
  });

  createCrop = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as CreateCropDto;
    const crop = await this.cropsService.createCrop(dto);
    return this.success(res, 'Crop created successfully', crop, 201);
  });

  updateCrop = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto = req.body as UpdateCropDto;
    const crop = await this.cropsService.updateCrop(id, dto);
    return this.success(res, 'Crop updated successfully', crop);
  });

  deleteCrop = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.cropsService.deleteCrop(id);
    return this.success(res, 'Crop deleted successfully');
  });
}

