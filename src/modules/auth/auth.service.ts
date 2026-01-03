import bcrypt from 'bcrypt';
import { prisma, User, UserRole } from '../../database';
import { BaseService } from '../../common/base/base.service';
import { BadRequestException, UnauthorizedException, ConflictException, NotFoundException } from '../../common/exceptions/app-exception';
import { generateTokenPair, JwtPayload } from '../../common/utils/jwt.util';
import { config } from '../../config/env';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

export class AuthService extends BaseService {
  /**
   * Register a new user
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Validate that either email or phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Check if user already exists
    if (dto.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (dto.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        name: dto.name,
        password: hashedPassword,
        role: dto.role || UserRole.FARMER,
        stateId: dto.stateId,
        districtId: dto.districtId,
        villageId: dto.villageId,
        landSize: dto.landSize,
        preferredCrops: dto.preferredCrops || [],
      },
      include: {
        state: true,
        district: true,
        village: true,
      },
    });

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const tokens = generateTokenPair(payload);

    // Store refresh token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: refreshTokenExpiry,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email || undefined,
        phone: user.phone || undefined,
        role: user.role,
        stateId: user.stateId || undefined,
        districtId: user.districtId || undefined,
        villageId: user.villageId || undefined,
        landSize: user.landSize || undefined,
        preferredCrops: user.preferredCrops,
      },
    };
  }

  /**
   * Login user
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    // Validate that either email or phone is provided
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          dto.email ? { email: dto.email } : {},
          dto.phone ? { phone: dto.phone } : {},
        ],
      },
      include: {
        state: true,
        district: true,
        village: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const tokens = generateTokenPair(payload);

    // Store refresh token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: refreshTokenExpiry,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email || undefined,
        phone: user.phone || undefined,
        role: user.role,
        stateId: user.stateId || undefined,
        districtId: user.districtId || undefined,
        villageId: user.villageId || undefined,
        landSize: user.landSize || undefined,
        preferredCrops: user.preferredCrops,
      },
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    // Find refresh token
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!refreshTokenRecord || refreshTokenRecord.isRevoked) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (refreshTokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Check if user is still active
    if (!refreshTokenRecord.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate new tokens
    const payload: JwtPayload = {
      userId: refreshTokenRecord.user.id,
      email: refreshTokenRecord.user.email || undefined,
      phone: refreshTokenRecord.user.phone || undefined,
      role: refreshTokenRecord.user.role,
    };

    const tokens = generateTokenPair(payload);

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { isRevoked: true },
    });

    // Store new refresh token
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId: refreshTokenRecord.user.id,
        token: tokens.refreshToken,
        expiresAt: refreshTokenExpiry,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (refreshTokenRecord) {
      await prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { isRevoked: true },
      });
    }
  }
}

