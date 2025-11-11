import { Module } from '@nestjs/common';
import { InsuranceProvidersResolver } from './insurance-providers.resolver';
import { InsuranceProvidersService } from './insurance-providers.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    InsuranceProvidersResolver,
    InsuranceProvidersService,
    PrismaService,
  ],
})
export class InsuranceProvidersModule {}
