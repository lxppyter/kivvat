import { Module } from '@nestjs/common';
import { AwsScanner } from './aws.scanner';
import { AzureScanner } from './azure.scanner';
import { ScannerService } from './scanner.service';
import { ScannerController } from './scanner.controller';
import { CloudModule } from '../cloud/cloud.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [CloudModule, PrismaModule, TaskModule],
  controllers: [ScannerController],
  providers: [AwsScanner, AzureScanner, ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
