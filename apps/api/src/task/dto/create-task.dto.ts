import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  gapAnalysisId?: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string; // User ID to assign

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
