import { UserRole } from '../../../database';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: UserRole;
    stateId?: string;
    districtId?: string;
    villageId?: string;
    landSize?: number;
    preferredCrops?: string[];
  };
}

