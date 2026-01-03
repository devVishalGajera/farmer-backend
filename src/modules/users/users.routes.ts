import { Router } from 'express';
import { UsersController } from './users.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { jwtGuard } from '../../common/guards/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';

const router = Router();
const usersController = new UsersController();

router.get('/profile', jwtGuard, usersController.getProfile);
router.put('/profile', jwtGuard, validateDto(UpdateUserDto), usersController.updateProfile);

export default router;

