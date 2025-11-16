import { Module } from '@nestjs/common';
import { RehabResolver } from './rehab.resolver';
import { RehabService } from './rehab.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [RehabResolver, RehabService, PrismaService],
  exports: [RehabService],
})
export class RehabModule {}
