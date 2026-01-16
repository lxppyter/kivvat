import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PolicyController],
  providers: [PolicyService],
})
export class PolicyModule {}
