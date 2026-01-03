import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { AreasService } from './areas.service';
import { CreateStateDto, CreateDistrictDto, CreateVillageDto } from './dto/create-area.dto';

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Area management endpoints (States, Districts, Villages)
 */
export class AreasController extends BaseController {
  private areasService: AreasService;

  constructor() {
    super();
    this.areasService = new AreasService();
  }

  // States
  getAllStates = this.asyncHandler(async (req: Request, res: Response) => {
    const states = await this.areasService.getAllStates();
    return this.success(res, 'States retrieved successfully', states);
  });

  getStateById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = await this.areasService.getStateById(id);
    return this.success(res, 'State retrieved successfully', state);
  });

  createState = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as CreateStateDto;
    const state = await this.areasService.createState(dto);
    return this.success(res, 'State created successfully', state, 201);
  });

  // Districts
  getDistrictsByState = this.asyncHandler(async (req: Request, res: Response) => {
    const { stateId } = req.params;
    const districts = await this.areasService.getDistrictsByState(stateId);
    return this.success(res, 'Districts retrieved successfully', districts);
  });

  getDistrictById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const district = await this.areasService.getDistrictById(id);
    return this.success(res, 'District retrieved successfully', district);
  });

  createDistrict = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as CreateDistrictDto;
    const district = await this.areasService.createDistrict(dto);
    return this.success(res, 'District created successfully', district, 201);
  });

  // Villages
  getVillagesByDistrict = this.asyncHandler(async (req: Request, res: Response) => {
    const { districtId } = req.params;
    const villages = await this.areasService.getVillagesByDistrict(districtId);
    return this.success(res, 'Villages retrieved successfully', villages);
  });

  getVillageById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const village = await this.areasService.getVillageById(id);
    return this.success(res, 'Village retrieved successfully', village);
  });

  createVillage = this.asyncHandler(async (req: Request, res: Response) => {
    const dto = req.body as CreateVillageDto;
    const village = await this.areasService.createVillage(dto);
    return this.success(res, 'Village created successfully', village, 201);
  });
}

