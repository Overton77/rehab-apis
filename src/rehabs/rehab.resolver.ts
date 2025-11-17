import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RehabService } from './rehab.service';
import { Rehab as RehabGqlModel } from 'src/@generated/rehab/rehab.model';
import {
  RehabCreateWithLookupsInput,
  RehabFiltersInput,
  RehabFindOneInput,
} from './rehab-filters.input';
import { RehabCreateInput } from 'src/@generated/rehab/rehab-create.input';
import { RehabUpdateInput } from 'src/@generated/rehab/rehab-update.input';
import { InsurancePayer } from 'src/@generated/insurance-payer/insurance-payer.model';
import { RehabInsurancePayer } from 'src/@generated/rehab-insurance-payer/rehab-insurance-payer.model';
import { RehabPaymentOption } from 'src/@generated/rehab-payment-option/rehab-payment-option.model';
import { RehabLevelOfCare } from 'src/@generated/rehab-level-of-care/rehab-level-of-care.model';
import { RehabService as RehabServiceGqlModel } from 'src/@generated/rehab-service/rehab-service.model';
import { RehabDetoxService } from 'src/@generated/rehab-detox-service/rehab-detox-service.model';
import { RehabPopulation } from 'src/@generated/rehab-population/rehab-population.model';
import { RehabAccreditation } from 'src/@generated/rehab-accreditation/rehab-accreditation.model';
import { RehabLanguage } from 'src/@generated/rehab-language/rehab-language.model';
import { RehabAmenity } from 'src/@generated/rehab-amenity/rehab-amenity.model';
import { RehabEnvironment } from 'src/@generated/rehab-environment/rehab-environment.model';
import { RehabSettingStyle } from 'src/@generated/rehab-setting-style/rehab-setting-style.model';
import { RehabLuxuryTier } from 'src/@generated/rehab-luxury-tier/rehab-luxury-tier.model';
import { RehabProgramFeature } from 'src/@generated/rehab-program-feature/rehab-program-feature.model';
@Resolver(() => RehabGqlModel)
export class RehabResolver {
  constructor(private service: RehabService) {}

  // ============================================
  // QUERIES
  // ============================================

  @Query(() => [RehabGqlModel], {
    description: 'Get a paginated list of rehabs with optional filters',
  })
  async rehabs(
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip?: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 20 })
    take?: number,
    @Args('filters', { type: () => RehabFiltersInput, nullable: true })
    filters?: RehabFiltersInput,
  ): Promise<RehabGqlModel[]> {
    return this.service.findMany({ skip, take, filters });
  }

  @Query(() => RehabGqlModel, {
    nullable: true,
    description: 'Find a single rehab by filters',
  })
  async rehab(
    @Args('filters', { type: () => RehabFindOneInput, nullable: true })
    filters?: RehabFindOneInput,
  ): Promise<RehabGqlModel | null> {
    return await this.service.findOne({ filters });
  }

  @Query(() => RehabGqlModel, {
    nullable: true,
    description: 'Get a single rehab by ID',
  })
  async rehabById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RehabGqlModel | null> {
    return await this.service.findById(id);
  }

  @Query(() => RehabGqlModel, {
    nullable: true,
    description: 'Get a single rehab by slug',
  })
  async rehabBySlug(
    @Args('slug', { type: () => String }) slug: string,
  ): Promise<RehabGqlModel | null> {
    return await this.service.findBySlug(slug);
  }

  @Query(() => Int, {
    description: 'Get total count of rehabs matching the filters',
  })
  async rehabsCount(
    @Args('filters', { type: () => RehabFiltersInput, nullable: true })
    filters?: RehabFiltersInput,
  ): Promise<number> {
    return await this.service.count(filters);
  }

  // ============================================
  // MUTATIONS
  // ============================================

  @Mutation(() => RehabGqlModel, {
    description:
      'Create a new facility which creates new relationships (NOT connectOrCreate)',
  })
  async createRehabWithNested(
    @Args('data', { type: () => RehabCreateInput }) data: RehabCreateInput,
  ): Promise<RehabGqlModel> {
    return await this.service.createRehabWithNested(data);
  }

  @Mutation(() => RehabGqlModel, {
    description:
      'Create a new facility which creates new relationships (connectOrCreate)',
  })
  async createRehabWithConnectOrCreate(
    @Args('data', { type: () => RehabCreateWithLookupsInput })
    data: RehabCreateWithLookupsInput,
  ): Promise<RehabGqlModel> {
    return await this.service.createRehabWithConnectOrCreate(data);
  }

  @Mutation(() => [RehabGqlModel], {
    description: 'Create multiple rehab facilities with nested relationships',
  })
  async createManyRehabsWithNested(
    @Args('data', { type: () => [RehabCreateInput] }) data: RehabCreateInput[],
  ): Promise<RehabGqlModel[]> {
    return await this.service.createManyRehabsWithNested(data);
  }

  @Mutation(() => RehabGqlModel, {
    description: 'Update an existing rehab facility',
  })
  async updateRehab(
    @Args('id', { type: () => String }) id: string,
    @Args('data', { type: () => RehabUpdateInput }) data: RehabUpdateInput,
  ): Promise<RehabGqlModel> {
    return await this.service.updateRehabWithNested(id, data);
  }

  @Mutation(() => RehabGqlModel, {
    nullable: true,
    description: 'Delete a rehab facility',
  })
  async deleteRehab(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RehabGqlModel | null> {
    return await this.service.delete(id);
  }

  // ============================================
  // FIELD RESOLVERS (Prevent N+1 Problem)
  // ============================================
  // These field resolvers only load relationship data when explicitly requested
  // in the GraphQL query, and they use caching to avoid redundant database calls

  @ResolveField(() => [InsurancePayer], {
    nullable: true,
    description:
      'Insurance payers accepted by this rehab with average admission prices',
  })
  async insurancePayers(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabInsurancePayer[]> {
    console.log('RehabResolver: parent Rehab . InsurancePayers', rehab);

    console.log('RehabResolver: rehab.insurancePayers', rehab.insurancePayers);
    if (rehab.insurancePayers && rehab.insurancePayers.length > 0) {
      return rehab.insurancePayers;
    }

    return (await this.service.getInsurancePayers(
      rehab.id,
    )) as RehabInsurancePayer[];
  }

  @ResolveField(() => [RehabPaymentOption], {
    nullable: true,
    description: 'Payment options available at this rehab',
  })
  async paymentOptions(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabPaymentOption[]> {
    if (rehab.paymentOptions && rehab.paymentOptions.length > 0) {
      return rehab.paymentOptions;
    }

    return (await this.service.getPaymentOptions(
      rehab.id,
    )) as RehabPaymentOption[];
  }

  @ResolveField(() => [RehabLevelOfCare], {
    nullable: true,
    description: 'Levels of care provided by this rehab',
  })
  async levelsOfCare(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabLevelOfCare[]> {
    if (rehab.levelsOfCare && rehab.levelsOfCare.length > 0) {
      return rehab.levelsOfCare;
    }

    return (await this.service.getLevelsOfCare(rehab.id)) as RehabLevelOfCare[];
  }

  @ResolveField(() => [RehabServiceGqlModel], {
    nullable: true,
    description: 'Services and therapies offered at this rehab',
  })
  async services(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabServiceGqlModel[]> {
    if (rehab.services && rehab.services.length > 0) {
      return rehab.services;
    }

    return (await this.service.getServices(rehab.id)) as RehabServiceGqlModel[];
  }

  @ResolveField(() => [RehabDetoxService], {
    nullable: true,
    description: 'Detoxification services available',
  })
  async detoxServices(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabDetoxService[]> {
    if (rehab.detoxServices && rehab.detoxServices.length > 0) {
      return rehab.detoxServices;
    }

    return (await this.service.getDetoxServices(
      rehab.id,
    )) as RehabDetoxService[];
  }

  @ResolveField(() => [RehabPopulation], {
    nullable: true,
    description: 'Populations and specialty groups served',
  })
  async populations(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabPopulation[]> {
    if (rehab.populations && rehab.populations.length > 0) {
      return rehab.populations;
    }

    return (await this.service.getPopulations(rehab.id)) as RehabPopulation[];
  }

  @ResolveField(() => [RehabAccreditation], {
    nullable: true,
    description: 'Accreditations held by this rehab',
  })
  async accreditations(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabAccreditation[]> {
    if (rehab.accreditations && rehab.accreditations.length > 0) {
      return rehab.accreditations;
    }

    return (await this.service.getAccreditations(
      rehab.id,
    )) as RehabAccreditation[];
  }

  @ResolveField(() => [RehabLanguage], {
    nullable: true,
    description: 'Languages spoken at this facility',
  })
  async languages(@Parent() rehab: RehabGqlModel): Promise<RehabLanguage[]> {
    if (rehab.languages && rehab.languages.length > 0) {
      return rehab.languages;
    }

    return (await this.service.getLanguages(rehab.id)) as RehabLanguage[];
  }

  @ResolveField(() => [RehabAmenity], {
    nullable: true,
    description: 'Amenities available at this rehab',
  })
  async amenities(@Parent() rehab: RehabGqlModel): Promise<RehabAmenity[]> {
    if (rehab.amenities && rehab.amenities.length > 0) {
      return rehab.amenities;
    }

    return (await this.service.getAmenities(rehab.id)) as RehabAmenity[];
  }

  @ResolveField(() => [RehabEnvironment], {
    nullable: true,
    description: 'Environmental setting of the facility',
  })
  async environments(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabEnvironment[]> {
    if (rehab.environments && rehab.environments.length > 0) {
      return rehab.environments;
    }

    return (await this.service.getEnvironments(rehab.id)) as RehabEnvironment[];
  }

  @ResolveField(() => [RehabSettingStyle], {
    nullable: true,
    description: 'Setting style of the facility',
  })
  async settingStyles(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabSettingStyle[]> {
    if (rehab.settingStyles && rehab.settingStyles.length > 0) {
      return rehab.settingStyles;
    }

    return (await this.service.getSettingStyles(
      rehab.id,
    )) as RehabSettingStyle[];
  }

  @ResolveField(() => [RehabLuxuryTier], {
    nullable: true,
    description: 'Luxury tier classification',
  })
  async luxuryTiers(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabLuxuryTier[]> {
    if (rehab.luxuryTiers && rehab.luxuryTiers.length > 0) {
      return rehab.luxuryTiers;
    }

    return (await this.service.getLuxuryTiers(rehab.id)) as RehabLuxuryTier[];
  }

  @ResolveField(() => [RehabProgramFeature], {
    nullable: true,
    description: 'Program features and operational characteristics',
  })
  async programFeatures(
    @Parent() rehab: RehabGqlModel,
  ): Promise<RehabProgramFeature[]> {
    if (rehab.programFeatures && rehab.programFeatures.length > 0) {
      return rehab.programFeatures;
    }

    return (await this.service.getProgramFeatures(
      rehab.id,
    )) as RehabProgramFeature[];
  }
}
