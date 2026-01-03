import { Router } from 'express';
import { MarketController } from './market.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { CreateMarketPriceDto, UpdateMarketPriceDto } from './dto/create-price.dto';

const router = Router();
const marketController = new MarketController();

router.get('/', marketController.getPrices);
router.get('/:id', marketController.getPriceById);
router.post('/', validateDto(CreateMarketPriceDto), marketController.createPrice);
router.put('/:id', validateDto(UpdateMarketPriceDto), marketController.updatePrice);
router.delete('/:id', marketController.deletePrice);

export default router;

