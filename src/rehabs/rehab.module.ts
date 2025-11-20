import { Module } from '@nestjs/common';
import { RehabOrgResolver } from './rehab-org.resolver';
import { RehabService } from './rehab.service';
import { RehabProgramResolver } from './rehab-program.resolver';
import { RehabCampusResolver } from './rehab-campus.resolver';
import { RehabTaxonomyResolver } from './rehab-taxonomy.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    RehabOrgResolver,
    RehabProgramResolver,
    RehabCampusResolver,
    RehabTaxonomyResolver,
    RehabService,
    PrismaService,
  ],
  exports: [RehabService],
})
export class RehabModule {}
