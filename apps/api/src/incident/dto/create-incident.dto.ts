import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  @IsOptional()
  @IsEnum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'])
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
}
