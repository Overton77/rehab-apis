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
import { PaymentOption } from 'src/@generated/payment-option/payment-option.model';
import { LevelOfCare } from 'src/@generated/level-of-care/level-of-care.model';
import { Service } from 'src/@generated/service/service.model';
import { DetoxService } from 'src/@generated/detox-service/detox-service.model';
import { Population } from 'src/@generated/population/population.model';
import { Accreditation } from 'src/@generated/accreditation/accreditation.model';
import { Language } from 'src/@generated/language/language.model';
import { Amenity } from 'src/@generated/amenity/amenity.model';
import { Environment } from 'src/@generated/environment/environment.model';
import { SettingStyle } from 'src/@generated/setting-style/setting-style.model';
import { LuxuryTier } from 'src/@generated/luxury-tier/luxury-tier.model';
import { ProgramFeature } from 'src/@generated/program-feature/program-feature.model';

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
  ): Promise<InsurancePayer[]> {
    if (
      rehab.insurancePayers &&
      rehab.insurancePayers.length > 0 &&
      rehab.insurancePayers[0].insurancePayer
    ) {
      return rehab.insurancePayers.map((rel) => rel.insurancePayer);
    }

    return (await this.service.getInsurancePayers(
      rehab.id,
    )) as InsurancePayer[];
  }

  @ResolveField(() => [PaymentOption], {
    nullable: true,
    description: 'Payment options available at this rehab',
  })
  async paymentOptions(
    @Parent() rehab: RehabGqlModel,
  ): Promise<PaymentOption[]> {
    if (
      rehab.paymentOptions &&
      rehab.paymentOptions.length > 0 &&
      rehab.paymentOptions[0].paymentOption
    ) {
      return rehab.paymentOptions.map((rel) => rel.paymentOption);
    }

    return (await this.service.getPaymentOptions(rehab.id)) as PaymentOption[];
  }

  @ResolveField(() => [LevelOfCare], {
    nullable: true,
    description: 'Levels of care provided by this rehab',
  })
  async levelsOfCare(@Parent() rehab: RehabGqlModel): Promise<LevelOfCare[]> {
    if (
      rehab.levelsOfCare &&
      rehab.levelsOfCare.length > 0 &&
      rehab.levelsOfCare[0].levelOfCare
    ) {
      return rehab.levelsOfCare.map((rel) => rel.levelOfCare);
    }

    return (await this.service.getLevelsOfCare(rehab.id)) as LevelOfCare[];
  }

  @ResolveField(() => [Service], {
    nullable: true,
    description: 'Services and therapies offered at this rehab',
  })
  async services(@Parent() rehab: RehabGqlModel): Promise<Service[]> {
    if (
      rehab.services &&
      rehab.services.length > 0 &&
      rehab.services[0].service
    ) {
      return rehab.services.map((rel) => rel.service);
    }

    return (await this.service.getServices(rehab.id)) as Service[];
  }

  @ResolveField(() => [DetoxService], {
    nullable: true,
    description: 'Detoxification services available',
  })
  async detoxServices(@Parent() rehab: RehabGqlModel): Promise<DetoxService[]> {
    if (
      rehab.detoxServices &&
      rehab.detoxServices.length > 0 &&
      rehab.detoxServices[0].detoxService
    ) {
      return rehab.detoxServices.map((rel) => rel.detoxService);
    }

    return (await this.service.getDetoxServices(rehab.id)) as DetoxService[];
  }

  @ResolveField(() => [Population], {
    nullable: true,
    description: 'Populations and specialty groups served',
  })
  async populations(@Parent() rehab: RehabGqlModel): Promise<Population[]> {
    if (
      rehab.populations &&
      rehab.populations.length > 0 &&
      rehab.populations[0].population
    ) {
      return rehab.populations.map((rel) => rel.population);
    }

    return (await this.service.getPopulations(rehab.id)) as Population[];
  }

  @ResolveField(() => [Accreditation], {
    nullable: true,
    description: 'Accreditations held by this rehab',
  })
  async accreditations(
    @Parent() rehab: RehabGqlModel,
  ): Promise<Accreditation[]> {
    if (
      rehab.accreditations &&
      rehab.accreditations.length > 0 &&
      rehab.accreditations[0].accreditation
    ) {
      return rehab.accreditations.map((rel) => rel.accreditation);
    }

    return (await this.service.getAccreditations(rehab.id)) as Accreditation[];
  }

  @ResolveField(() => [Language], {
    nullable: true,
    description: 'Languages spoken at this facility',
  })
  async languages(@Parent() rehab: RehabGqlModel): Promise<Language[]> {
    if (
      rehab.languages &&
      rehab.languages.length > 0 &&
      rehab.languages[0].language
    ) {
      return rehab.languages.map((rel) => rel.language);
    }

    return (await this.service.getLanguages(rehab.id)) as Language[];
  }

  @ResolveField(() => [Amenity], {
    nullable: true,
    description: 'Amenities available at this rehab',
  })
  async amenities(@Parent() rehab: RehabGqlModel): Promise<Amenity[]> {
    if (
      rehab.amenities &&
      rehab.amenities.length > 0 &&
      rehab.amenities[0].amenity
    ) {
      return rehab.amenities.map((rel) => rel.amenity);
    }

    return (await this.service.getAmenities(rehab.id)) as Amenity[];
  }

  @ResolveField(() => [Environment], {
    nullable: true,
    description: 'Environmental setting of the facility',
  })
  async environments(@Parent() rehab: RehabGqlModel): Promise<Environment[]> {
    if (
      rehab.environments &&
      rehab.environments.length > 0 &&
      rehab.environments[0].environment
    ) {
      return rehab.environments.map((rel) => rel.environment);
    }

    return (await this.service.getEnvironments(rehab.id)) as Environment[];
  }

  @ResolveField(() => [SettingStyle], {
    nullable: true,
    description: 'Setting style of the facility',
  })
  async settingStyles(@Parent() rehab: RehabGqlModel): Promise<SettingStyle[]> {
    if (
      rehab.settingStyles &&
      rehab.settingStyles.length > 0 &&
      rehab.settingStyles[0].settingStyle
    ) {
      return rehab.settingStyles.map((rel) => rel.settingStyle);
    }

    return (await this.service.getSettingStyles(rehab.id)) as SettingStyle[];
  }

  @ResolveField(() => [LuxuryTier], {
    nullable: true,
    description: 'Luxury tier classification',
  })
  async luxuryTiers(@Parent() rehab: RehabGqlModel): Promise<LuxuryTier[]> {
    if (
      rehab.luxuryTiers &&
      rehab.luxuryTiers.length > 0 &&
      rehab.luxuryTiers[0].luxuryTier
    ) {
      return rehab.luxuryTiers.map((rel) => rel.luxuryTier);
    }

    return (await this.service.getLuxuryTiers(rehab.id)) as LuxuryTier[];
  }

  @ResolveField(() => [ProgramFeature], {
    nullable: true,
    description: 'Program features and operational characteristics',
  })
  async programFeatures(
    @Parent() rehab: RehabGqlModel,
  ): Promise<ProgramFeature[]> {
    if (
      rehab.programFeatures &&
      rehab.programFeatures.length > 0 &&
      rehab.programFeatures[0].programFeature
    ) {
      return rehab.programFeatures.map((rel) => rel.programFeature);
    }

    return (await this.service.getProgramFeatures(
      rehab.id,
    )) as ProgramFeature[];
  }
}
