import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { AdminService } from './admin.service';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel endpoints
 */
export class AdminController extends BaseController {
  private adminService: AdminService;

  constructor() {
    super();
    this.adminService = new AdminService();
  }

  /**
   * @swagger
   * /api/v1/admin/dashboard:
   *   get:
   *     summary: Get admin dashboard statistics
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard stats retrieved successfully
   *       403:
   *         description: Forbidden - Admin access required
   */
  getDashboard = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await this.adminService.verifyAdmin(req.user.userId);
    const stats = await this.adminService.getDashboardStats();
    return this.success(res, 'Dashboard stats retrieved successfully', stats);
  });

  /**
   * @swagger
   * /api/v1/admin/users:
   *   get:
   *     summary: Get all users (admin only)
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *       403:
   *         description: Forbidden - Admin access required
   */
  getAllUsers = this.asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    await this.adminService.verifyAdmin(req.user.userId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await this.adminService.getAllUsers(page, limit);
    return this.paginated(res, 'Users retrieved successfully', result.users, page, limit, result.total);
  });
}

