import { prisma } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException } from '../../common/exceptions/app-exception';
import { CreateMarketPriceDto, UpdateMarketPriceDto } from './dto/create-price.dto';

export class MarketService extends BaseService {
  async getPrices(filters: {
    cropId?: string;
    stateId?: string;
    districtId?: string;
    limit?: number;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters.cropId) {
      where.cropId = filters.cropId;
    }

    if (filters.stateId) {
      where.stateId = filters.stateId;
    }

    if (filters.districtId) {
      where.districtId = filters.districtId;
    }

    return prisma.marketPrice.findMany({
      where,
      include: {
        crop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: filters.limit || 50,
    });
  }

  async getPriceById(id: string) {
    const price = await prisma.marketPrice.findUnique({
      where: { id },
      include: {
        crop: true,
      },
    });

    if (!price) {
      throw new NotFoundException('Market price not found');
    }

    return price;
  }

  async createPrice(dto: CreateMarketPriceDto) {
    // Verify crop exists
    const crop = await prisma.crop.findUnique({
      where: { id: dto.cropId },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return prisma.marketPrice.create({
      data: {
        cropId: dto.cropId,
        stateId: dto.stateId,
        districtId: dto.districtId,
        price: dto.price,
        unit: dto.unit || 'kg',
        date: dto.date ? new Date(dto.date) : new Date(),
        source: dto.source,
      },
      include: {
        crop: true,
      },
    });
  }

  async updatePrice(id: string, dto: UpdateMarketPriceDto) {
    const price = await prisma.marketPrice.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException('Market price not found');
    }

    return prisma.marketPrice.update({
      where: { id },
      data: {
        price: dto.price,
        unit: dto.unit,
        date: dto.date ? new Date(dto.date) : undefined,
        source: dto.source,
        isActive: dto.isActive !== undefined ? dto.isActive : undefined,
      },
      include: {
        crop: true,
      },
    });
  }

  async deletePrice(id: string) {
    const price = await prisma.marketPrice.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException('Market price not found');
    }

    return prisma.marketPrice.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

