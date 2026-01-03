import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { validateDto } from '../../common/middleware/validation.middleware';
import { jwtGuard } from '../../common/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
export class UsersController extends BaseController {
  private usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  }

  /**
   * @swagger
   * /api/v1/users/profile:
   *   get:
   *     summary: Get current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized
   */
  getProfile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const profile = await this.usersService.getProfile(req.user.userId);
    return this.success(res, 'Profile retrieved successfully', profile);
  });

  /**
   * @swagger
   * /api/v1/users/profile:
   *   put:
   *     summary: Update current user profile
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               stateId:
   *                 type: string
   *               districtId:
   *                 type: string
   *               villageId:
   *                 type: string
   *               landSize:
   *                 type: number
   *               preferredCrops:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       401:
   *         description: Unauthorized
   */
  updateProfile = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const dto = req.body as UpdateUserDto;
    const profile = await this.usersService.updateProfile(req.user.userId, dto);
    return this.success(res, 'Profile updated successfully', profile);
  });
}

