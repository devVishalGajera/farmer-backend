import { Router } from 'express';
import { AreasController } from './areas.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { CreateStateDto, CreateDistrictDto, CreateVillageDto } from './dto/create-area.dto';

const router = Router();
const areasController = new AreasController();

// States
router.get('/states', areasController.getAllStates);
router.get('/states/:id', areasController.getStateById);
router.post('/states', validateDto(CreateStateDto), areasController.createState);

// Districts
router.get('/states/:stateId/districts', areasController.getDistrictsByState);
router.get('/districts/:id', areasController.getDistrictById);
router.post('/districts', validateDto(CreateDistrictDto), areasController.createDistrict);

// Villages
router.get('/districts/:districtId/villages', areasController.getVillagesByDistrict);
router.get('/villages/:id', areasController.getVillageById);
router.post('/villages', validateDto(CreateVillageDto), areasController.createVillage);

export default router;

