import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RehabService } from './rehab.service';
import {
  LevelOfCareCreateManyInput,
  DetoxServiceCreateManyInput,
  MATTypeCreateManyInput,
  ServiceCreateManyInput,
  PopulationCreateManyInput,
  AccreditationCreateManyInput,
  LanguageCreateManyInput,
  AmenityCreateManyInput,
  EnvironmentCreateManyInput,
  SettingStyleCreateManyInput,
  LuxuryTierCreateManyInput,
  ProgramFeatureCreateManyInput,
  PaymentOptionCreateManyInput,
  InsurancePayerCreateManyInput,
  SubstanceCreateManyInput,
} from './rehab-taxonomy.inputs';

import {
  LevelOfCare as LevelOfCareModel,
  MATType as MATTypeModel,
  Service as ServiceModel,
  Population as PopulationModel,
  Accreditation as AccreditationModel,
  Language as LanguageModel,
  DetoxService as DetoxServiceModel,
  Amenity as AmenityModel,
  Environment as EnvironmentModel,
  SettingStyle as SettingStyleModel,
  LuxuryTier as LuxuryTierModel,
  ProgramFeature as ProgramFeatureModel,
  PaymentOption as PaymentOptionModel,
  InsurancePayer as InsurancePayerModel,
  Substance as SubstanceModel,
} from './lookups.model';

@Resolver()
export class RehabTaxonomyResolver {
  constructor(private readonly service: RehabService) {}

  // ---------- LevelOfCare ----------
  @Mutation(() => [LevelOfCareModel])
  createManyLevelOfCare(@Args('input') input: LevelOfCareCreateManyInput) {
    return this.service.createManyLevelOfCare(input.items);
  }

  @Query(() => [LevelOfCareModel])
  levelOfCares() {
    return this.service.findAllLevelsOfCare();
  }

  // ---------- DetoxService ----------
  @Mutation(() => [DetoxServiceModel])
  createManyDetoxService(@Args('input') input: DetoxServiceCreateManyInput) {
    return this.service.createManyDetoxService(input.items);
  }

  @Query(() => [DetoxServiceModel])
  detoxServices() {
    return this.service.findAllDetoxServices();
  }

  // ---------- MATType ----------
  @Mutation(() => [MATTypeModel])
  createManyMATType(@Args('input') input: MATTypeCreateManyInput) {
    return this.service.createManyMATType(input.items);
  }

  @Query(() => [MATTypeModel])
  matTypes() {
    return this.service.findAllMATTypes();
  }

  // ---------- Service ----------
  @Mutation(() => [ServiceModel])
  createManyService(@Args('input') input: ServiceCreateManyInput) {
    return this.service.createManyService(input.items);
  }

  @Query(() => [ServiceModel])
  services() {
    return this.service.findAllServices();
  }

  // ---------- Population ----------
  @Mutation(() => [PopulationModel])
  createManyPopulation(@Args('input') input: PopulationCreateManyInput) {
    return this.service.createManyPopulation(input.items);
  }

  @Query(() => [PopulationModel])
  populations() {
    return this.service.findAllPopulations();
  }

  // ---------- Accreditation ----------
  @Mutation(() => [AccreditationModel])
  createManyAccreditation(@Args('input') input: AccreditationCreateManyInput) {
    return this.service.createManyAccreditation(input.items);
  }

  @Query(() => [AccreditationModel])
  accreditations() {
    return this.service.findAllAccreditations();
  }

  // ---------- Language ----------
  @Mutation(() => [LanguageModel])
  createManyLanguage(@Args('input') input: LanguageCreateManyInput) {
    return this.service.createManyLanguage(input.items);
  }

  @Query(() => [LanguageModel])
  languages() {
    return this.service.findAllLanguages();
  }

  // ---------- Amenity ----------
  @Mutation(() => [AmenityModel])
  createManyAmenity(@Args('input') input: AmenityCreateManyInput) {
    return this.service.createManyAmenity(input.items);
  }

  @Query(() => [AmenityModel])
  amenities() {
    return this.service.findAllAmenities();
  }

  // ---------- Environment ----------
  @Mutation(() => [EnvironmentModel])
  createManyEnvironment(@Args('input') input: EnvironmentCreateManyInput) {
    return this.service.createManyEnvironment(input.items);
  }

  @Query(() => [EnvironmentModel])
  environments() {
    return this.service.findAllEnvironments();
  }

  // ---------- SettingStyle ----------
  @Mutation(() => [SettingStyleModel])
  createManySettingStyle(@Args('input') input: SettingStyleCreateManyInput) {
    return this.service.createManySettingStyle(input.items);
  }

  @Query(() => [SettingStyleModel])
  settingStyles() {
    return this.service.findAllSettingStyles();
  }

  // ---------- LuxuryTier ----------
  @Mutation(() => [LuxuryTierModel])
  createManyLuxuryTier(@Args('input') input: LuxuryTierCreateManyInput) {
    return this.service.createManyLuxuryTier(input.items);
  }

  @Query(() => [LuxuryTierModel])
  luxuryTiers() {
    return this.service.findAllLuxuryTiers();
  }

  // ---------- ProgramFeature ----------
  @Mutation(() => [ProgramFeatureModel])
  createManyProgramFeature(
    @Args('input') input: ProgramFeatureCreateManyInput,
  ) {
    return this.service.createManyProgramFeature(input.items);
  }

  @Query(() => [ProgramFeatureModel])
  programFeatures() {
    return this.service.findAllProgramFeatures();
  }

  // ---------- PaymentOption ----------
  @Mutation(() => [PaymentOptionModel])
  createManyPaymentOption(@Args('input') input: PaymentOptionCreateManyInput) {
    return this.service.createManyPaymentOption(input.items);
  }

  @Query(() => [PaymentOptionModel])
  paymentOptions() {
    return this.service.findAllPaymentOptions();
  }

  // ---------- InsurancePayer ----------
  @Mutation(() => [InsurancePayerModel])
  createManyInsurancePayer(
    @Args('input') input: InsurancePayerCreateManyInput,
  ) {
    return this.service.createManyInsurancePayer(input.items);
  }

  @Query(() => [InsurancePayerModel])
  insurancePayers() {
    return this.service.findAllInsurancePayers();
  }

  // ---------- Substance ----------
  @Mutation(() => [SubstanceModel])
  createManySubstance(@Args('input') input: SubstanceCreateManyInput) {
    return this.service.createManySubstance(input.items);
  }

  @Query(() => [SubstanceModel])
  substances() {
    return this.service.findAllSubstances();
  }
}
