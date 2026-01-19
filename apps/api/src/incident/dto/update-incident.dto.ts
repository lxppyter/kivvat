import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateIncidentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  @IsOptional()
  @IsEnum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'])
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
}
