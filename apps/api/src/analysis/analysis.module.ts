import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [TaskModule],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
