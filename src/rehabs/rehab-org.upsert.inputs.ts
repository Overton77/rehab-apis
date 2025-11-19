// src/rehabs/dto/rehab-upsert.inputs.ts
import { Field, InputType, Int } from '@nestjs/graphql';

import {
  // Org + shared helpers
  ParentCompanyConnectOrCreateInput,
  RehabCampusConnectOrCreateInput,
  LevelOfCareConnectOrCreateInput,
  DetoxServiceConnectOrCreateInput,
  ServiceConnectOrCreateInput,
  PopulationConnectOrCreateInput,
  AccreditationConnectOrCreateInput,
  LanguageConnectOrCreateInput,
  AmenityConnectOrCreateInput,
  EnvironmentConnectOrCreateInput,
  SettingStyleConnectOrCreateInput,
  LuxuryTierConnectOrCreateInput,
  ProgramFeatureGlobalConnectOrCreateInput,
  YoutubeChannelConnectOrCreateInput,
  SocialMediaProfileConnectOrCreateInput,
  OrgReviewCreateInput,
  OrgTestimonialCreateInput,
  OrgStoryCreateInput,
  RehabInsurancePayerConnectOrCreateInput,
  RehabPaymentOptionConnectOrCreateInput,
} from './rehab-org-create.input';

// ---------------------------------------------------------------------
// UPSERT: RehabOrg
//  - WHERE:   id (required)
//  - DATA:    everything from CreateRehabOrgInput, but all optional
// ---------------------------------------------------------------------

@InputType()
export class UpsertRehabOrgInput {
  // WHERE
  @Field()
  id!: string;

  // Core scalar fields (all optional for update; enforced on create in service)
  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  legalName?: string;

  @Field({ nullable: true })
  npi_number?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  tagline?: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field({ nullable: true })
  mainPhone?: string;

  @Field({ nullable: true })
  mainEmail?: string;

  @Field(() => Int, { nullable: true })
  yearFounded?: number;

  @Field({ nullable: true })
  isNonProfit?: boolean;

  @Field({ nullable: true })
  verifiedExists?: boolean;

  @Field({ nullable: true })
  primarySourceUrl?: string;

  @Field(() => [String], { nullable: true })
  otherSourceUrls?: string[];

  @Field({ nullable: true })
  baseCurrency?: string;

  @Field(() => Int, { nullable: true })
  fullPrivatePrice?: number;

  @Field({ nullable: true })
  defaultTimeZone?: string;

  // Nested relations

  @Field(() => ParentCompanyConnectOrCreateInput, { nullable: true })
  parentCompany?: ParentCompanyConnectOrCreateInput;

  @Field(() => [RehabCampusConnectOrCreateInput], { nullable: true })
  campuses?: RehabCampusConnectOrCreateInput[];

  @Field(() => [AccreditationConnectOrCreateInput], { nullable: true })
  accreditations?: AccreditationConnectOrCreateInput[];

  @Field(() => [OrgReviewCreateInput], { nullable: true })
  reviews?: OrgReviewCreateInput[];

  @Field(() => [OrgTestimonialCreateInput], { nullable: true })
  testimonials?: OrgTestimonialCreateInput[];

  @Field(() => [OrgStoryCreateInput], { nullable: true })
  stories?: OrgStoryCreateInput[];

  @Field(() => [LevelOfCareConnectOrCreateInput], { nullable: true })
  levelsOfCare?: LevelOfCareConnectOrCreateInput[];

  @Field(() => [DetoxServiceConnectOrCreateInput], { nullable: true })
  detoxServices?: DetoxServiceConnectOrCreateInput[];

  @Field(() => [ServiceConnectOrCreateInput], { nullable: true })
  services?: ServiceConnectOrCreateInput[];

  @Field(() => [PopulationConnectOrCreateInput], { nullable: true })
  populations?: PopulationConnectOrCreateInput[];

  @Field(() => [LanguageConnectOrCreateInput], { nullable: true })
  languages?: LanguageConnectOrCreateInput[];

  @Field(() => [AmenityConnectOrCreateInput], { nullable: true })
  amenities?: AmenityConnectOrCreateInput[];

  @Field(() => [EnvironmentConnectOrCreateInput], { nullable: true })
  environments?: EnvironmentConnectOrCreateInput[];

  @Field(() => [SettingStyleConnectOrCreateInput], { nullable: true })
  settingStyles?: SettingStyleConnectOrCreateInput[];

  @Field(() => [LuxuryTierConnectOrCreateInput], { nullable: true })
  luxuryTiers?: LuxuryTierConnectOrCreateInput[];

  @Field(() => [ProgramFeatureGlobalConnectOrCreateInput], { nullable: true })
  programFeaturesGlobal?: ProgramFeatureGlobalConnectOrCreateInput[];

  @Field(() => [RehabInsurancePayerConnectOrCreateInput], { nullable: true })
  insurancePayers?: RehabInsurancePayerConnectOrCreateInput[];

  @Field(() => [RehabPaymentOptionConnectOrCreateInput], { nullable: true })
  paymentOptions?: RehabPaymentOptionConnectOrCreateInput[];

  @Field(() => [YoutubeChannelConnectOrCreateInput], { nullable: true })
  youtubeChannels?: YoutubeChannelConnectOrCreateInput[];

  @Field(() => [SocialMediaProfileConnectOrCreateInput], { nullable: true })
  socialMediaProfiles?: SocialMediaProfileConnectOrCreateInput[];
}
