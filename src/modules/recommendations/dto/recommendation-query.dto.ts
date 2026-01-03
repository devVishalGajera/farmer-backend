import { IsString, IsOptional } from 'class-validator';

export class RecommendationQueryDto {
  @IsString()
  cropId: string;

  @IsOptional()
  @IsString()
  stateId?: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsOptional()
  @IsString()
  villageId?: string;
}

