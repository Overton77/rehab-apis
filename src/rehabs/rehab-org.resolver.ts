import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RehabService } from './rehab.service';

import {
  RehabLevelOfCare,
  RehabDetoxService,
  RehabService as RehabOrgService,
  RehabPopulation,
  RehabAccreditation,
  RehabLanguage,
  RehabAmenity,
  RehabEnvironment,
  RehabSettingStyle,
  RehabLuxuryTier,
  RehabProgramFeatureGlobal,
} from './rehab-joins.model';

import { ParentCompany, RehabOrg } from './core.model';
import { DeleteResult } from './mutation-results';
import { CreateRehabOrgInput } from './rehab-org-create.input';
import { RehabInsurancePayer, RehabPaymentOption } from './finance.model';
import { RehabOrgFilterInput } from './rehab-filters.input';
import { UpsertRehabOrgInput } from './rehab-org.upsert.inputs';

@Resolver(() => RehabOrg)
export class RehabOrgResolver {
  constructor(private service: RehabService) {}

  // ============================================
  // QUERIES
  // ============================================

  // ============================================
  // MUTATIONS
  // ============================================

  @Mutation(() => RehabOrg, {
    description:
      'Create a new facility which creates new relationships (NOT connectOrCreate)',
  })
  async createRehabOrgWithConnectOrCreate(
    @Args('data', { type: () => CreateRehabOrgInput })
    data: CreateRehabOrgInput,
  ): Promise<RehabOrg> {
    const rehabOrgs =
      await this.service.createRehabOrgWithConnectOrCreate(data);

    return rehabOrgs;
  }

  @Mutation(() => RehabOrg, {
    description: 'Upsert a RehabOrg with nested ConnectOrCreate',
  })
  async upsertRehabOrgWithConnectOrCreate(
    @Args('data', { type: () => UpsertRehabOrgInput })
    data: UpsertRehabOrgInput,
  ): Promise<RehabOrg> {
    const rehabOrg = await this.service.upsertRehabOrgWithConnectOrCreate(data);
    return rehabOrg;
  }

  @Mutation(() => DeleteResult)
  async deleteRehab(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DeleteResult> {
    return await this.service.deleteRehabOrg(id);
  }

  @Query(() => RehabOrg)
  async findRehabOrgById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RehabOrg> {
    const rehab = await this.service.findRehabOrgById(id);

    return rehab;
  }

  // Queries findById and findMany

  @Query(() => [RehabOrg])
  async findManyRehabOrgs(
    @Args('data', { type: () => RehabOrgFilterInput })
    data: RehabOrgFilterInput,
  ): Promise<RehabOrg[]> {
    const rehabOrgs = await this.service.findManyRehabOrgs(data);

    return rehabOrgs;
  }

  // ============================================
  // FIELD RESOLVERS (Prevent N+1 Problem)
  // ============================================
  // These field resolvers only load relationship data when explicitly requested
  // in the GraphQL query, and they use caching to avoid redundant database calls

  // We can lazily load these as well . It is quite an easy fix.
  @ResolveField(() => [RehabInsurancePayer], {
    nullable: true,
    description:
      'Insurance payers accepted by this rehab with average admission prices',
  })
  insurancePayers(@Parent() rehab: RehabOrg): RehabInsurancePayer[] {
    console.log('RehabResolver: parent Rehab . InsurancePayers', rehab);

    if (rehab.insurancePayers && rehab.insurancePayers.length) {
      return rehab.insurancePayers;
    }
  }

  @ResolveField(() => [RehabPaymentOption], {
    nullable: true,
    description: 'Payment options available at this rehab',
  })
  paymentOptions(@Parent() rehab: RehabOrg): RehabPaymentOption[] {
    if (rehab.paymentOptions && rehab.paymentOptions.length > 0) {
      return rehab.paymentOptions;
    }
  }

  @ResolveField(() => [RehabLevelOfCare], {
    nullable: true,
    description: 'Levels of care provided by this rehab',
  })
  levelsOfCare(@Parent() rehab: RehabOrg): RehabLevelOfCare[] {
    if (rehab.levelsOfCare && rehab.levelsOfCare.length > 0) {
      return rehab.levelsOfCare;
    }
  }

  @ResolveField(() => [RehabOrgService], {
    nullable: true,
    description: 'Services and therapies offered at this rehab',
  })
  services(@Parent() rehab: RehabOrg): RehabOrgService[] {
    if (rehab.services && rehab.services.length > 0) {
      return rehab.services;
    }
  }

  @ResolveField(() => [RehabDetoxService], {
    nullable: true,
    description: 'Detoxification services available',
  })
  detoxServices(@Parent() rehab: RehabOrg): RehabDetoxService[] {
    if (rehab.detoxServices && rehab.detoxServices.length > 0) {
      return rehab.detoxServices;
    }
  }

  @ResolveField(() => ParentCompany, {
    description: 'Returns the parent company',
  })
  parentCompany(@Parent() rehab: RehabOrg): ParentCompany {
    if (rehab.parentCompany) {
      return rehab.parentCompany;
    }
  }

  @ResolveField(() => [RehabPopulation], {
    nullable: true,
    description: 'Populations and specialty groups served',
  })
  populations(@Parent() rehab: RehabOrg): RehabPopulation[] {
    if (rehab.populations && rehab.populations.length > 0) {
      return rehab.populations;
    }
  }

  @ResolveField(() => [RehabAccreditation], {
    nullable: true,
    description: 'Accreditations held by this rehab',
  })
  accreditations(@Parent() rehab: RehabOrg): RehabAccreditation[] {
    if (rehab.orgAccreditations && rehab.orgAccreditations.length > 0) {
      return rehab.orgAccreditations;
    }
  }

  @ResolveField(() => [RehabLanguage], {
    nullable: true,
    description: 'Languages spoken at this facility',
  })
  languages(@Parent() rehab: RehabOrg): RehabLanguage[] {
    if (rehab.languages && rehab.languages.length > 0) {
      return rehab.languages;
    }
  }

  @ResolveField(() => [RehabAmenity], {
    nullable: true,
    description: 'Amenities available at this rehab',
  })
  amenities(@Parent() rehab: RehabOrg): RehabAmenity[] {
    if (rehab.amenities && rehab.amenities.length > 0) {
      return rehab.amenities;
    }
  }

  @ResolveField(() => [RehabEnvironment], {
    nullable: true,
    description: 'Environmental setting of the facility',
  })
  environments(@Parent() rehab: RehabOrg): RehabEnvironment[] {
    if (rehab.environments && rehab.environments.length > 0) {
      return rehab.environments;
    }
  }

  @ResolveField(() => [RehabSettingStyle], {
    nullable: true,
    description: 'Setting style of the facility',
  })
  settingStyles(@Parent() rehab: RehabOrg): RehabSettingStyle[] {
    if (rehab.settingStyles && rehab.settingStyles.length > 0) {
      return rehab.settingStyles;
    }
  }

  @ResolveField(() => [RehabLuxuryTier], {
    nullable: true,
    description: 'Luxury tier classification',
  })
  luxuryTiers(@Parent() rehab: RehabOrg): RehabLuxuryTier[] {
    if (rehab.luxuryTiers && rehab.luxuryTiers.length > 0) {
      return rehab.luxuryTiers;
    }
  }

  @ResolveField(() => [RehabProgramFeatureGlobal], {
    nullable: true,
    description: 'Program features and operational characteristics',
  })
  programFeatures(@Parent() rehab: RehabOrg): RehabProgramFeatureGlobal[] {
    if (rehab.programFeaturesGlobal && rehab.programFeaturesGlobal.length > 0) {
      return rehab.programFeaturesGlobal;
    }
  }
}
