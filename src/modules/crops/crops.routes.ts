import { Router } from 'express';
import { CropsController } from './crops.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';

const router = Router();
const cropsController = new CropsController();

router.get('/', cropsController.getAllCrops);
router.get('/:id', cropsController.getCropById);
router.post('/', validateDto(CreateCropDto), cropsController.createCrop);
router.put('/:id', validateDto(UpdateCropDto), cropsController.updateCrop);
router.delete('/:id', cropsController.deleteCrop);

export default router;

