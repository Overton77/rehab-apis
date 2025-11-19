// src/rehabs/dto/rehab-org-create.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ReviewSource,
  ReviewerType,
  StoryType,
  LevelOfCareType,
  NetworkStatus,
  InsuranceScope,
} from './common.enums';

// ---------------------------
// Nested helper inputs
// ---------------------------

// Parent company (single, optional)
@InputType()
export class ParentCompanyConnectOrCreateInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  verifiedExists?: boolean;

  @Field({ nullable: true })
  headquartersCity: string;

  @Field({ nullable: true })
  headquartersState: string;
  @Field({ nullable: true })
  headquartersCountry: string;

  @Field({ nullable: true })
  headquartersPostalCode: string;

  @Field({ nullable: true })
  headquartersStreet: string;

  // If neither id nor slug is provided, service can decide whether to create or error
}

// ------------ Campuses ------------

@InputType()
export class RehabCampusCreateForOrgInput {
  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  street!: string;

  @Field()
  city!: string;

  @Field()
  state!: string;

  @Field()
  postalCode!: string;

  @Field()
  country!: string;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  timeZone?: string;

  @Field({ nullable: true })
  visitingHours?: string;

  @Field({ nullable: true })
  directionsSummary?: string;

  @Field(() => Int, { nullable: true })
  bedsTotal?: number;

  @Field(() => Int, { nullable: true })
  bedsDetox?: number;

  @Field(() => Int, { nullable: true })
  bedsResidential?: number;

  @Field(() => Int, { nullable: true })
  bedsOutpatientCapacity?: number;

  @Field({ nullable: true })
  acceptsWalkIns?: boolean;

  @Field({ nullable: true })
  hasOnsiteMD?: boolean;

  @Field({ nullable: true })
  hasTwentyFourHourNursing?: boolean;

  @Field({ nullable: true })
  primaryEnvironmentSlug?: string; // maps to Environment.slug
  @Field({ nullable: true })
  primarySettingStyleSlug?: string; // maps to SettingStyle.slug
  @Field({ nullable: true })
  primaryLuxuryTierSlug?: string; // maps to LuxuryTier.slug
}

@InputType()
export class RehabCampusConnectOrCreateInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => RehabCampusCreateForOrgInput, { nullable: true })
  create?: RehabCampusCreateForOrgInput;
}

// ------------ Simple vocab connect-or-create by slug ------------

@InputType()
export class LevelOfCareConnectOrCreateInput {
  @Field()
  slug!: string; // unique

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => LevelOfCareType, { nullable: true })
  type?: LevelOfCareType;
}

@InputType()
export class DetoxServiceConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ServiceConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class PopulationConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class AccreditationConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class LanguageConnectOrCreateInput {
  @Field()
  code!: string; // "en", "es" etc.

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class AmenityConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class EnvironmentConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class SettingStyleConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class LuxuryTierConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field(() => Int, { nullable: true })
  rank?: number;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ProgramFeatureGlobalConnectOrCreateInput {
  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

// ------------ Media connect-or-create ------------

@InputType()
export class YoutubeChannelConnectOrCreateInput {
  @Field({ nullable: true })
  id!: string;

  @Field()
  url!: string;
  // If id is provided → connect by id; otherwise connectOrCreate by url
}

@InputType()
export class SocialMediaProfileConnectOrCreateInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  platform!: string;

  @Field()
  url!: string;
}

// ------------ Org content (create-only) ------------

@InputType()
export class OrgReviewCreateInput {
  @Field(() => Int)
  rating!: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  body!: string;

  @Field(() => ReviewerType, { nullable: true })
  reviewerType?: ReviewerType;

  @Field({ nullable: true })
  reviewerName?: string;

  @Field({ nullable: true })
  reviewerRole?: string;

  @Field(() => ReviewSource, { nullable: true })
  source?: ReviewSource;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field({ nullable: true })
  isFeatured?: boolean;

  @Field({ nullable: true })
  isVerified?: boolean;
}

@InputType()
export class OrgTestimonialCreateInput {
  @Field()
  quote!: string;

  @Field({ nullable: true })
  attributionName?: string;

  @Field({ nullable: true })
  attributionRole?: string;

  @Field({ nullable: true })
  source?: string;

  @Field({ nullable: true })
  isFeatured?: boolean;
}

@InputType()
export class OrgStoryCreateInput {
  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field(() => StoryType, { nullable: true })
  storyType?: StoryType;

  @Field({ nullable: true })
  summary?: string;

  @Field()
  body!: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  isFeatured?: boolean;
}

// ---------------------------
// Main RehabOrg create input
// ---------------------------

@InputType()
export class PaymentOptionConnectOrCreateInput {
  /**
   * Unique identifier to connect by (optional – use slug in most cases).
   */
  @Field({ nullable: true })
  id?: string;

  /**
   * Unique slug to connectOrCreate by (recommended).
   * Example: "cash_self_pay", "sliding_scale"
   */
  @Field({ nullable: true })
  slug?: string;

  /**
   * Fields used when creating a new PaymentOption.
   * If a record with this slug already exists, these are ignored.
   */
  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class InsurancePayerConnectOrCreateInput {
  /**
   * Unique identifier to connect by (optional – use slug in most cases).
   */
  @Field({ nullable: true })
  id?: string;

  /**
   * Unique slug to connectOrCreate by.
   * Example: "aetna", "bcbs"
   */
  @Field({ nullable: true })
  slug?: string;

  /**
   * Fields used when creating a new InsurancePayer.
   */
  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;

  /**
   * "commercial", "medicare", "medicaid", etc.
   */
  @Field({ nullable: true })
  payerType?: string;
}

// ------------------------------------------------------
// Edge layer: RehabInsurancePayer / RehabPaymentOption
// ------------------------------------------------------

// This is used inside Org/Campus/Program create inputs.
// Context (org vs campus vs program) is provided by the parent,
// so we do NOT include rehabId/campusId/programId here; the service fills those.

@InputType()
export class RehabInsurancePayerConnectOrCreateInput {
  /**
   * The underlying payer vocab record to connectOrCreate.
   */
  @Field(() => InsurancePayerConnectOrCreateInput)
  insurancePayer!: InsurancePayerConnectOrCreateInput;

  /**
   * Scope of this relationship (ORG, CAMPUS, PROGRAM).
   * In many cases you’ll set this in the service based on context and can omit it here.
   */
  @Field(() => InsuranceScope, { nullable: true })
  scope?: InsuranceScope;

  @Field(() => NetworkStatus, { nullable: true })
  networkStatus?: NetworkStatus;

  // Cost signals (facility currency)
  @Field(() => Int, { nullable: true })
  averageAdmissionPrice?: number;

  @Field(() => Int, { nullable: true })
  estimatedPatientOopMin?: number;

  @Field(() => Int, { nullable: true })
  estimatedPatientOopMax?: number;

  @Field({ nullable: true })
  requiresPreauth?: boolean;

  @Field({ nullable: true })
  acceptsOutOfNetworkWithOopCap?: boolean;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  overview?: string;
}

@InputType()
export class RehabPaymentOptionConnectOrCreateInput {
  /**
   * The underlying payment option vocab record to connectOrCreate.
   */
  @Field(() => PaymentOptionConnectOrCreateInput)
  paymentOption!: PaymentOptionConnectOrCreateInput;

  /**
   * Program- or campus-specific note that overrides the base description.
   */
  @Field({ nullable: true })
  descriptionOverride?: string;
}

@InputType()
export class CreateRehabOrgInput {
  // ---- Core fields (no id/timestamps) ----

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

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

  // ---- Relations (all second-class) ----

  @Field(() => ParentCompanyConnectOrCreateInput, { nullable: true })
  parentCompany?: ParentCompanyConnectOrCreateInput;

  @Field(() => [RehabInsurancePayerConnectOrCreateInput], { nullable: true })
  insurancePayers?: RehabInsurancePayerConnectOrCreateInput[];

  @Field(() => [RehabPaymentOptionConnectOrCreateInput], { nullable: true })
  paymentOptions: RehabPaymentOptionConnectOrCreateInput[];

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

  @Field(() => [YoutubeChannelConnectOrCreateInput], { nullable: true })
  youtubeChannels?: YoutubeChannelConnectOrCreateInput[];

  @Field(() => [SocialMediaProfileConnectOrCreateInput], { nullable: true })
  socialMediaProfiles?: SocialMediaProfileConnectOrCreateInput[];
}
