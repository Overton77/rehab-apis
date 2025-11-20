import { Field, ID, InputType, Int, Float } from '@nestjs/graphql';
import { WaitlistCategory } from './common.enums';

// ------------------------------------------------------
// Primitive filter helpers
// ------------------------------------------------------

@InputType()
export class StringFilter {
  @Field({ nullable: true })
  equals?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field({ nullable: true })
  contains?: string;

  @Field({ nullable: true })
  startsWith?: string;

  @Field({ nullable: true })
  endsWith?: string;

  @Field({ nullable: true })
  insensitive?: boolean;
}

@InputType()
export class BooleanFilter {
  @Field({ nullable: true })
  equals?: boolean;
}

@InputType()
export class IntRangeFilter {
  @Field(() => Int, { nullable: true })
  min?: number;

  @Field(() => Int, { nullable: true })
  max?: number;
}

@InputType()
export class FloatRangeFilter {
  @Field(() => Float, { nullable: true })
  min?: number;

  @Field(() => Float, { nullable: true })
  max?: number;
}

// ------------------------------------------------------
// RehabOrg findOne / findMany
// ------------------------------------------------------

@InputType()
export class RehabOrgWhereUniqueInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  slug?: string;

  // if you ever want to look up by NPI:
  @Field({ nullable: true })
  npi_number?: string;
}

@InputType()
export class RehabOrgFilterInput {
  // -------- identity / basic search --------

  @Field(() => [ID], { nullable: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  slugs?: string[];

  // full-text-ish search across name/description/tagline, etc.
  @Field({ nullable: true })
  search?: string; 

  @Field({nullable: true})  
  skip?: number; 

  @Field({nullable: true}) 
  take?: number; 

  // -------- core fields --------

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  legalName?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  npiNumber?: StringFilter;

  @Field(() => [String], { nullable: true })
  states?: string[];

  @Field(() => [String], { nullable: true })
  cities?: string[];

  @Field(() => [String], { nullable: true })
  zips?: string[];

  @Field(() => [String], { nullable: true })
  countries?: string[];

  @Field(() => BooleanFilter, { nullable: true })
  isNonProfit?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  verifiedExists?: BooleanFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  yearFounded?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  fullPrivatePrice?: IntRangeFilter;

  // -------- join-table filters (arrays of ids) --------
  // interpret as: org has ANY of these ids in that join table

  @Field(() => [String], { nullable: true })
  accreditationIds?: string[]; // RehabAccreditation.accreditationId

  @Field(() => [String], { nullable: true })
  levelOfCareIds?: string[]; // RehabLevelOfCare.levelOfCareId

  @Field(() => [String], { nullable: true })
  detoxServiceIds?: string[]; // RehabDetoxService.detoxServiceId

  @Field(() => [String], { nullable: true })
  serviceIds?: string[]; // RehabService.serviceId

  @Field(() => [String], { nullable: true })
  populationIds?: string[]; // RehabPopulation.populationId

  @Field(() => [String], { nullable: true })
  languageIds?: string[]; // RehabLanguage.languageId

  @Field(() => [String], { nullable: true })
  amenityIds?: string[]; // RehabAmenity.amenityId

  @Field(() => [String], { nullable: true })
  environmentIds?: string[]; // RehabEnvironment.environmentId

  @Field(() => [String], { nullable: true })
  settingStyleIds?: string[]; // RehabSettingStyle.settingStyleId

  @Field(() => [String], { nullable: true })
  luxuryTierIds?: string[]; // RehabLuxuryTier.luxuryTierId

  @Field(() => [String], { nullable: true })
  programFeatureGlobalIds?: string[]; // RehabProgramFeatureGlobal.programFeatureId

  @Field(() => [String], { nullable: true })
  insurancePayerIds?: string[]; // RehabInsurancePayer.insurancePayerId (any scope)

  @Field(() => [String], { nullable: true })
  paymentOptionIds?: string[]; // RehabPaymentOption.paymentOptionId

  // -------- relational filters via campuses/programs (optional but handy) --------

  // Org has at least one campus in these states
  @Field(() => [String], { nullable: true })
  campusStates?: string[];

  // Org has at least one program in these level-of-care ids
  @Field(() => [String], { nullable: true })
  programLevelOfCareIds?: string[];

  // Org has at least one program with these MAT types
  @Field(() => [String], { nullable: true })
  programMATTypeIds?: string[];

  // Org has at least one program treating these substances
  @Field(() => [String], { nullable: true })
  programSubstanceIds?: string[];
}

// ------------------------------------------------------
// RehabCampus findOne / findMany
// ------------------------------------------------------

@InputType()
export class RehabCampusWhereUniqueInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  slug?: string;
}

@InputType()
export class RehabCampusFilterInput {
  // -------- identity / basic search --------

  @Field(() => [ID], { nullable: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  slugs?: string[]; 

  @Field({nullable: true})  
  skip?: number; 

  @Field({nullable: true}) 
  take?: number; 

  @Field(() => [String], { nullable: true })
  rehabOrgIds?: string[];

  @Field({ nullable: true })
  search?: string;

  // -------- location fields --------

  @Field(() => [String], { nullable: true })
  states?: string[];

  @Field(() => [String], { nullable: true })
  cities?: string[];

  @Field(() => [String], { nullable: true })
  postalCodes?: string[];

  @Field(() => [String], { nullable: true })
  countries?: string[];

  // Optional: you can implement geo/radius later
  @Field({ nullable: true })
  nearLat?: number;

  @Field({ nullable: true })
  nearLng?: number;

  @Field({ nullable: true })
  radiusKm?: number;

  // -------- operational / clinical-ish flags --------

  @Field(() => IntRangeFilter, { nullable: true })
  bedsTotal?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  bedsDetox?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  bedsResidential?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  bedsOutpatientCapacity?: IntRangeFilter;

  @Field(() => BooleanFilter, { nullable: true })
  acceptsWalkIns?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  hasOnsiteMD?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  hasTwentyFourHourNursing?: BooleanFilter;

  // primary aesthetic descriptors by vocab id

  @Field(() => [String], { nullable: true })
  primaryEnvironmentIds?: string[];

  @Field(() => [String], { nullable: true })
  primarySettingStyleIds?: string[];

  @Field(() => [String], { nullable: true })
  primaryLuxuryTierIds?: string[];

  // -------- campus-level join-table filters --------

  @Field(() => [String], { nullable: true })
  campusAmenityIds?: string[]; // RehabCampusAmenity.amenityId

  @Field(() => [String], { nullable: true })
  campusLanguageIds?: string[]; // RehabCampusLanguage.languageId

  @Field(() => [String], { nullable: true })
  campusPopulationIds?: string[]; // RehabCampusPopulation.populationId

  @Field(() => [String], { nullable: true })
  campusEnvironmentIds?: string[]; // RehabCampusEnvironment.environmentId

  @Field(() => [String], { nullable: true })
  campusSettingStyleIds?: string[]; // RehabCampusSettingStyle.settingStyleId

  @Field(() => [String], { nullable: true })
  campusLuxuryTierIds?: string[]; // RehabCampusLuxuryTier.luxuryTierId

  @Field(() => [String], { nullable: true })
  insurancePayerIds?: string[]; // RehabInsurancePayer.insurancePayerId (scope CAMPUS or any)

  @Field(() => [String], { nullable: true })
  paymentOptionIds?: string[]; // RehabPaymentOption.paymentOptionId

  // -------- program-derived filters --------

  @Field(() => [String], { nullable: true })
  programLevelOfCareIds?: string[]; // via programs.levelOfCareId

  @Field(() => [String], { nullable: true })
  programDetoxServiceIds?: string[]; // via RehabProgramDetoxService.detoxServiceId

  @Field(() => [String], { nullable: true })
  programServiceIds?: string[]; // via RehabProgramService.serviceId

  @Field(() => [String], { nullable: true })
  programPopulationIds?: string[]; // RehabProgramPopulation.populationId

  @Field(() => [String], { nullable: true })
  programLanguageIds?: string[]; // RehabProgramLanguage.languageId

  @Field(() => [String], { nullable: true })
  programAmenityIds?: string[]; // RehabProgramAmenity.amenityId

  @Field(() => [String], { nullable: true })
  programFeatureIds?: string[]; // RehabProgramFeature.programFeatureId

  @Field(() => [String], { nullable: true })
  programMATTypeIds?: string[]; // RehabProgramMATType.matTypeId

  @Field(() => [String], { nullable: true })
  programSubstanceIds?: string[]; // RehabProgramSubstance.substanceId
}

// ------------------------------------------------------
// RehabProgram findOne / findMany
// ------------------------------------------------------

@InputType()
export class RehabProgramWhereUniqueInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  slug?: string;
}

@InputType()
export class RehabProgramFilterInput {
  // -------- identity / basic search --------

  @Field(() => [ID], { nullable: true })
  ids?: string[];

  @Field(() => [String], { nullable: true })
  slugs?: string[]; 
  @Field({nullable: true})  
  skip?: number; 

  @Field({nullable: true}) 
  take?: number; 

  @Field(() => [String], { nullable: true })
  campusIds?: string[];

  @Field(() => [String], { nullable: true })
  rehabOrgIds?: string[]; // via program.campus.rehabOrgId (service will translate)

  @Field(() => [String], { nullable: true })
  levelOfCareIds?: string[];

  @Field({ nullable: true })
  search?: string;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  // -------- structure & schedule --------

  @Field(() => IntRangeFilter, { nullable: true })
  minLengthOfStayDays?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  maxLengthOfStayDays?: IntRangeFilter;

  @Field(() => IntRangeFilter, { nullable: true })
  typicalLengthOfStayDays?: IntRangeFilter;

  @Field({ nullable: true })
  sessionScheduleContains?: string; // simple substring filter

  // -------- clinical flags --------

  @Field(() => BooleanFilter, { nullable: true })
  isDetoxPrimary?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  isMATProgram?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  hasOnsiteMD?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  hasTwentyFourHourNursing?: BooleanFilter;

  @Field(() => FloatRangeFilter, { nullable: true })
  staffToPatientRatio?: FloatRangeFilter;

  @Field(() => BooleanFilter, { nullable: true })
  acceptsSelfReferral?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  acceptsCourtOrdered?: BooleanFilter;

  @Field(() => BooleanFilter, { nullable: true })
  acceptsMedicallyComplex?: BooleanFilter;

  @Field(() => [WaitlistCategory], { nullable: true })
  waitlistCategories?: WaitlistCategory[];

  // -------- join-table filters (ids) --------

  @Field(() => [String], { nullable: true })
  detoxServiceIds?: string[]; // RehabProgramDetoxService.detoxServiceId

  @Field(() => [String], { nullable: true })
  serviceIds?: string[]; // RehabProgramService.serviceId

  @Field(() => [String], { nullable: true })
  populationIds?: string[]; // RehabProgramPopulation.populationId

  @Field(() => [String], { nullable: true })
  languageIds?: string[]; // RehabProgramLanguage.languageId

  @Field(() => [String], { nullable: true })
  amenityIds?: string[]; // RehabProgramAmenity.amenityId

  @Field(() => [String], { nullable: true })
  featureIds?: string[]; // RehabProgramFeature.programFeatureId

  @Field(() => [String], { nullable: true })
  matTypeIds?: string[]; // RehabProgramMATType.matTypeId

  @Field(() => [String], { nullable: true })
  substanceIds?: string[]; // RehabProgramSubstance.substanceId

  @Field(() => [String], { nullable: true })
  insurancePayerIds?: string[]; // RehabInsurancePayer.insurancePayerId (scope PROGRAM or any)

  @Field(() => [String], { nullable: true })
  paymentOptionIds?: string[]; // RehabPaymentOption.paymentOptionId
}
