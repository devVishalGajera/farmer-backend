import { IsString, IsOptional, MinLength, IsNumber, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

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

