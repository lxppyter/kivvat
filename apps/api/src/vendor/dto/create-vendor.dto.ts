import { IsEnum, IsNotEmpty, IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  contactName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @IsBoolean()
  @IsOptional()
  hasIso27001?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSoc2?: boolean;

  @IsBoolean()
  @IsOptional()
  hasGdpr?: boolean;
}
