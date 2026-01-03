import { IsString, IsOptional } from 'class-validator';

export class CreateStateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;
}

export class CreateDistrictDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  stateId: string;
}

export class CreateVillageDto {
  @IsString()
  name: string;

  @IsString()
  districtId: string;
}

