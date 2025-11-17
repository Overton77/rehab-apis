// src/rehab/rehab-filters.input.ts
import { InputType, Field, ID, OmitType } from '@nestjs/graphql';
import { RehabCreateInput } from 'src/@generated/rehab/rehab-create.input';

@InputType()
export class RehabFiltersInput {
  @Field(() => [String], { nullable: true })
  states?: string[];

  @Field(() => [String], { nullable: true })
  cities?: string[];

  @Field(() => Boolean, { nullable: true })
  verifiedExists?: boolean;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => [ID], { nullable: true })
  programFeatureIds?: string[];

  // Setting styles: RehabSettingStyle.settingStyleId
  @Field(() => [ID], { nullable: true })
  settingStyleIds?: string[];

  @Field(() => [ID], { nullable: true })
  insurancePayerIds?: string[];

  @Field(() => [ID], { nullable: true })
  paymentOptionIds?: string[];

  @Field(() => [ID], { nullable: true })
  levelOfCareIds?: string[];

  @Field(() => [ID], { nullable: true })
  serviceIds?: string[];

  @Field(() => [ID], { nullable: true })
  detoxServiceIds?: string[];

  @Field(() => [ID], { nullable: true })
  populationIds?: string[];

  @Field(() => [ID], { nullable: true })
  accreditationIds?: string[];

  @Field(() => [ID], { nullable: true })
  languageIds?: string[];

  @Field(() => [ID], { nullable: true })
  amenityIds?: string[];

  @Field(() => [ID], { nullable: true })
  environmentIds?: string[];

  @Field(() => [ID], { nullable: true })
  luxuryTierIds?: string[];
}

@InputType()
export class RehabFindOneInput {
  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => Boolean, { nullable: true })
  verifiedExists?: boolean;

  @Field(() => String, { nullable: true })
  search?: string;

  // RELATION FILTERS (singular versions)
  @Field(() => ID, { nullable: true })
  programFeatureId?: string;

  @Field(() => ID, { nullable: true })
  settingStyleId?: string;

  @Field(() => ID, { nullable: true })
  insurancePayerId?: string;

  @Field(() => ID, { nullable: true })
  paymentOptionId?: string;

  @Field(() => ID, { nullable: true })
  levelOfCareId?: string;

  @Field(() => ID, { nullable: true })
  serviceId?: string;

  @Field(() => ID, { nullable: true })
  detoxServiceId?: string;

  @Field(() => ID, { nullable: true })
  populationId?: string;

  @Field(() => ID, { nullable: true })
  accreditationId?: string;

  @Field(() => ID, { nullable: true })
  languageId?: string;

  @Field(() => ID, { nullable: true })
  amenityId?: string;

  @Field(() => ID, { nullable: true })
  environmentId?: string;

  @Field(() => ID, { nullable: true })
  luxuryTierId?: string;
}

@InputType()
export class SlugRelationInput {
  @Field()
  slug: string;
  description: string;

  @Field({ nullable: true })
  displayName?: string;
}

@InputType()
export class InsurancePayerRelationInput {
  @Field()
  slug: string;
  description: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  overview?: string;
}

// Language is keyed by code
@InputType()
export class LanguageRelationInput {
  @Field()
  code: string;
  description: string;

  @Field()
  displayName: string;
}

// Luxury tier has rank too
@InputType()
export class LuxuryTierRelationInput {
  @Field()
  slug: string;
  description: string;

  @Field()
  displayName: string;

  @Field()
  rank: number;
}

@InputType()
export class RehabCreateWithLookupsInput extends OmitType(RehabCreateInput, [
  'insurancePayers',
  'paymentOptions',
  'levelsOfCare',
  'services',
  'detoxServices',
  'populations',
  'accreditations',
  'languages',
  'amenities',
  'environments',
  'settingStyles',
  'luxuryTiers',
  'programFeatures',
] as const) {
  @Field(() => [SlugRelationInput], { nullable: true })
  insurancePayers?: InsurancePayerRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  paymentOptions?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  levelsOfCare?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  services?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  detoxServices?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  populations?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  accreditations?: SlugRelationInput[];

  @Field(() => [LanguageRelationInput], { nullable: true })
  languages?: LanguageRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  amenities?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  environments?: SlugRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  settingStyles?: SlugRelationInput[];

  @Field(() => [LuxuryTierRelationInput], { nullable: true })
  luxuryTiers?: LuxuryTierRelationInput[];

  @Field(() => [SlugRelationInput], { nullable: true })
  programFeatures?: SlugRelationInput[];
}
