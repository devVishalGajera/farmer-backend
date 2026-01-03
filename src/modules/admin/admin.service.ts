import { prisma, UserRole } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException, ForbiddenException } from '../../common/exceptions/app-exception';

export class AdminService extends BaseService {
  /**
   * Verify user is admin
   */
  async verifyAdmin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get dashboard stats (admin only)
   */
  async getDashboardStats() {
    const [totalUsers, totalFarmers, totalAdmins, totalCrops, totalStates, totalDistricts, totalVillages] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.FARMER } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.crop.count({ where: { isActive: true } }),
      prisma.state.count(),
      prisma.district.count(),
      prisma.village.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        admins: totalAdmins,
      },
      crops: {
        total: totalCrops,
      },
      areas: {
        states: totalStates,
        districts: totalDistricts,
        villages: totalVillages,
      },
    };
  }
}

