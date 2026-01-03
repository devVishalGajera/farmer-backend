import { prisma } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException } from '../../common/exceptions/app-exception';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';

export class CropsService extends BaseService {
  async getAllCrops(activeOnly: boolean = false) {
    return prisma.crop.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async getCropById(id: string) {
    const crop = await prisma.crop.findUnique({
      where: { id },
      include: {
        suitabilityRules: {
          where: { isActive: true },
        },
        marketPrices: {
          where: { isActive: true },
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return crop;
  }

  async createCrop(dto: CreateCropDto) {
    return prisma.crop.create({
      data: dto,
    });
  }

  async updateCrop(id: string, dto: UpdateCropDto) {
    const crop = await prisma.crop.findUnique({
      where: { id },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return prisma.crop.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCrop(id: string) {
    const crop = await prisma.crop.findUnique({
      where: { id },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return prisma.crop.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

