import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { CropSeason } from '../../../database';

export class CreateCropDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  scientificName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CropSeason)
  season?: CropSeason;

  @IsOptional()
  @IsNumber()
  minTemperature?: number;

  @IsOptional()
  @IsNumber()
  maxTemperature?: number;

  @IsOptional()
  @IsNumber()
  minRainfall?: number;

  @IsOptional()
  @IsNumber()
  maxRainfall?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suitableStates?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCropDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  scientificName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CropSeason)
  season?: CropSeason;

  @IsOptional()
  @IsNumber()
  minTemperature?: number;

  @IsOptional()
  @IsNumber()
  maxTemperature?: number;

  @IsOptional()
  @IsNumber()
  minRainfall?: number;

  @IsOptional()
  @IsNumber()
  maxRainfall?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suitableStates?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

