import { Module } from '@nestjs/common';
import { ProspectiveRehabsResolver } from './prospective-rehabs.resolver';
import { ProspectiveRehabsService } from './prospective-rehabs.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    ProspectiveRehabsResolver,
    ProspectiveRehabsService,
    PrismaService,
  ],
})
export class ProspectiveRehabsModule {}
