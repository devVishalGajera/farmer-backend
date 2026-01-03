import { prisma } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException, UnauthorizedException } from '../../common/exceptions/app-exception';
import { UpdateUserDto } from './dto/update-user.dto';

export class UsersService extends BaseService {
  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        state: true,
        district: true,
        village: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        stateId: true,
        districtId: true,
        villageId: true,
        landSize: true,
        preferredCrops: true,
        state: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        district: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        village: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        stateId: dto.stateId,
        districtId: dto.districtId,
        villageId: dto.villageId,
        landSize: dto.landSize,
        preferredCrops: dto.preferredCrops,
      },
      include: {
        state: true,
        district: true,
        village: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        stateId: true,
        districtId: true,
        villageId: true,
        landSize: true,
        preferredCrops: true,
        state: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        district: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        village: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}

