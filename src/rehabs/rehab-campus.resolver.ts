import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  ID,
  Parent,
} from '@nestjs/graphql';
import { RehabService } from './rehab.service';

import {
  RehabCampusAmenity,
  RehabCampusLanguage,
  RehabCampusPopulation,
  RehabCampusEnvironment,
  RehabCampusSettingStyle,
  RehabCampusLuxuryTier,
} from './campus-joins.model';

import {
  Environment as ResolverEnvironment,
  SettingStyle as ResolverSettingStyle,
  LuxuryTier as ResolverLuxuryTier,
} from './lookups.model';

import { SocialMediaProfile } from './core.model';

import { RehabCampus } from './core.model';
import { DeleteResult } from './mutation-results';
import { CreateRehabCampusInput } from './rehab-program-create.input';
import { RehabInsurancePayer, RehabPaymentOption } from './finance.model';
import { RehabCampusFilterInput } from './rehab-filters.input';
import { UpsertRehabCampusInput } from './rehab-campus.upsert.inputs';

@Resolver(() => RehabCampus)
export class RehabCampusResolver {
  constructor(private service: RehabService) {}

  @Mutation(() => RehabCampus, {
    description: 'Create a new Rehab Campus with connect or create',
  })
  async createRehabCampusWithConnectOrCreate(
    @Args('data', { type: () => CreateRehabCampusInput })
    data: CreateRehabCampusInput,
  ): Promise<RehabCampus> {
    const rehabCampus =
      await this.service.createRehabCampusWithConnectOrCreate(data);

    return rehabCampus;
  }

  @Mutation(() => RehabCampus, {
    description: 'Upsert a Rehab Campus With Connect or create',
  })
  async upsertRehabCampusWithConnectOrCreate(
    @Args('data', { type: () => UpsertRehabCampusInput })
    data: UpsertRehabCampusInput,
  ): Promise<RehabCampus> {
    const rehabCampus =
      await this.service.upsertRehabCampusWithConnectOrCreate(data);
    return rehabCampus;
  }

  @Mutation(() => DeleteResult, {
    description: 'Delete  Rehab Campus',
  })
  async deleteRehabCampus(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DeleteResult> {
    const deletedId = await this.service.deleteRehabCampus(id);

    return deletedId;
  }

  @Query(() => [RehabCampus], {
    description: 'Find many rehab campus with extensive filters',
  })
  async findManyRehabCampuses(
    @Args('data', { type: () => RehabCampusFilterInput })
    data: RehabCampusFilterInput,
  ): Promise<RehabCampus[]> {
    const rehabCampuses = await this.service.findManyRehabCampuses(data);
    return rehabCampuses;
  }

  @Query(() => RehabCampus, {
    description: 'Find Rehab Campus By ID',
  })
  async findRehabCampusById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RehabCampus> {
    const rehabCampus = await this.service.findRehabCampusById(id);
    return rehabCampus;
  }

  @ResolveField(() => [RehabInsurancePayer], {
    nullable: true,
    description:
      'Insurance payers accepted by this rehab with average admission prices',
  })
  insurancePayers(@Parent() rehabCampus: RehabCampus): RehabInsurancePayer[] {
    console.log('RehabResolver: parent Rehab . InsurancePayers', rehabCampus);

    if (rehabCampus.insurancePayers && rehabCampus.insurancePayers.length) {
      return rehabCampus.insurancePayers;
    }
  }

  @ResolveField(() => [RehabPaymentOption], {
    nullable: true,
    description: 'Payment options available at this rehab',
  })
  paymentOptions(@Parent() rehabCampus: RehabCampus): RehabPaymentOption[] {
    if (rehabCampus.paymentOptions && rehabCampus.paymentOptions.length > 0) {
      return rehabCampus.paymentOptions;
    }
  }

  @ResolveField(() => ResolverEnvironment, {
    nullable: true,
    description: 'Levels of care provided by this rehab',
  })
  primaryEnvironment(@Parent() rehabCampus: RehabCampus): ResolverEnvironment {
    if (rehabCampus.primaryEnvironment) {
      return rehabCampus.primaryEnvironment;
    }
  }

  @ResolveField(() => ResolverSettingStyle, {
    nullable: true,
    description: 'Services and therapies offered at this rehab',
  })
  services(@Parent() rehab: RehabCampus): ResolverSettingStyle {
    if (rehab.primarySettingStyle) {
      return rehab.primarySettingStyle;
    }
  }

  @ResolveField(() => ResolverLuxuryTier, {
    nullable: true,
    description: 'Detoxification services available',
  })
  detoxServices(@Parent() rehab: RehabCampus): ResolverLuxuryTier {
    if (rehab.primaryLuxuryTier) {
      return rehab.primaryLuxuryTier;
    }
  }

  @ResolveField(() => [RehabCampusAmenity], {
    nullable: true,
    description: 'Populations and specialty groups served',
  })
  populations(@Parent() rehab: RehabCampus): RehabCampusAmenity[] {
    if (rehab.campusAmenities && rehab.campusAmenities.length > 0) {
      return rehab.campusAmenities;
    }
  }

  @ResolveField(() => [RehabCampusPopulation], {
    nullable: true,
    description: 'Accreditations held by this rehab',
  })
  accreditations(@Parent() rehab: RehabCampus): RehabCampusPopulation[] {
    if (rehab.campusPopulations && rehab.campusPopulations.length > 0) {
      return rehab.campusPopulations;
    }
  }

  @ResolveField(() => [RehabCampusLanguage], {
    nullable: true,
    description: 'Languages spoken at this facility',
  })
  languages(@Parent() rehab: RehabCampus): RehabCampusLanguage[] {
    if (rehab.campusLanguages && rehab.campusLanguages.length > 0) {
      return rehab.campusLanguages;
    }
  }

  @ResolveField(() => [RehabCampusSettingStyle], {
    nullable: true,
    description: 'Setting style of the facility',
  })
  settingStyles(@Parent() rehab: RehabCampus): RehabCampusSettingStyle[] {
    if (rehab.campusSettingStyles && rehab.campusSettingStyles.length > 0) {
      return rehab.campusSettingStyles;
    }
  }

  @ResolveField(() => [RehabCampusLuxuryTier], {
    nullable: true,
    description: 'Luxury tier classification',
  })
  luxuryTiers(@Parent() rehab: RehabCampus): RehabCampusLuxuryTier[] {
    if (rehab.campusLuxuryTiers && rehab.campusLuxuryTiers.length > 0) {
      return rehab.campusLuxuryTiers;
    }
  }

  @ResolveField(() => [SocialMediaProfile], {
    nullable: true,
    description: 'Program features and operational characteristics',
  })
  programFeatures(@Parent() rehab: RehabCampus): SocialMediaProfile[] {
    if (rehab.socialMediaProfiles && rehab.socialMediaProfiles.length > 0) {
      return rehab.socialMediaProfiles;
    }
  }
}
