import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsArray, IsNumber } from 'class-validator';
import { UserRole } from '../../../database';

export class RegisterDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  stateId?: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsString()
  villageId?: string;

  @IsOptional()
  @IsNumber()
  landSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCrops?: string[];
}

