import { Router } from 'express';
import { AdminController } from './admin.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';
import { rolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../database';

const router = Router();
const adminController = new AdminController();

// All admin routes require JWT and ADMIN role
router.use(jwtGuard);
router.use(rolesGuard([UserRole.ADMIN]));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);

export default router;

