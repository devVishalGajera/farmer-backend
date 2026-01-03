import { prisma } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { NotFoundException } from '../../common/exceptions/app-exception';
import { CreateStateDto, CreateDistrictDto, CreateVillageDto } from './dto/create-area.dto';

export class AreasService extends BaseService {
  // States
  async getAllStates() {
    return prisma.state.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getStateById(id: string) {
    const state = await prisma.state.findUnique({
      where: { id },
      include: {
        districts: {
          include: {
            villages: true,
          },
        },
      },
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    return state;
  }

  async createState(dto: CreateStateDto) {
    return prisma.state.create({
      data: dto,
    });
  }

  // Districts
  async getDistrictsByState(stateId: string) {
    return prisma.district.findMany({
      where: { stateId },
      include: {
        villages: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getDistrictById(id: string) {
    const district = await prisma.district.findUnique({
      where: { id },
      include: {
        state: true,
        villages: true,
      },
    });

    if (!district) {
      throw new NotFoundException('District not found');
    }

    return district;
  }

  async createDistrict(dto: CreateDistrictDto) {
    // Verify state exists
    const state = await prisma.state.findUnique({
      where: { id: dto.stateId },
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    return prisma.district.create({
      data: dto,
      include: {
        state: true,
      },
    });
  }

  // Villages
  async getVillagesByDistrict(districtId: string) {
    return prisma.village.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
    });
  }

  async getVillageById(id: string) {
    const village = await prisma.village.findUnique({
      where: { id },
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });

    if (!village) {
      throw new NotFoundException('Village not found');
    }

    return village;
  }

  async createVillage(dto: CreateVillageDto) {
    // Verify district exists
    const district = await prisma.district.findUnique({
      where: { id: dto.districtId },
    });

    if (!district) {
      throw new NotFoundException('District not found');
    }

    return prisma.village.create({
      data: dto,
      include: {
        district: {
          include: {
            state: true,
          },
        },
      },
    });
  }
}

