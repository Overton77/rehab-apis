// src/rehabs/dto/rehab-campus-program-create.input.ts
import { Field, InputType, Int, Float } from '@nestjs/graphql';
import {
  ReviewSource,
  ReviewerType,
  StoryType,
  WaitlistCategory,
} from './common.enums';

// Reuse helper inputs from the RehabOrg create DTO
import {
  AmenityConnectOrCreateInput,
  ServiceConnectOrCreateInput,
  PopulationConnectOrCreateInput,
  LanguageConnectOrCreateInput,
  EnvironmentConnectOrCreateInput,
  SettingStyleConnectOrCreateInput,
  LuxuryTierConnectOrCreateInput,
  ProgramFeatureGlobalConnectOrCreateInput,
  SocialMediaProfileConnectOrCreateInput,
  DetoxServiceConnectOrCreateInput,
} from './rehab-org-create.input';

// ------------------------------------------------------
// Extra vocab helpers for Program
// ------------------------------------------------------

@InputType()
export class MATTypeConnectOrCreateInput {
  @Field()
  slug!: string; // "methadone", "buprenorphine", ...

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  medicationClass?: string; // "opioid_agonist", etc.

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class SubstanceConnectOrCreateInput {
  @Field()
  slug!: string; // "alcohol", "opioids", "stimulants", ...

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  category?: string; // "depressant", "stimulant", etc.

  @Field({ nullable: true })
  description?: string;
}

// ------------------------------------------------------
// Content create inputs for Campus
// ------------------------------------------------------

@InputType()
export class CampusReviewCreateInput {
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
export class CampusTestimonialCreateInput {
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
export class CampusStoryCreateInput {
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

// ------------------------------------------------------
// Content create inputs for Program
// ------------------------------------------------------

@InputType()
export class ProgramReviewCreateInput {
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
export class ProgramTestimonialCreateInput {
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
export class ProgramStoryCreateInput {
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

// ------------------------------------------------------
// CreateRehabCampusInput
// ------------------------------------------------------

@InputType()
export class CreateRehabCampusInput {
  // ---- Parent org reference (connect only) ----

  @Field({ nullable: true })
  rehabOrgId?: string;

  @Field({ nullable: true })
  rehabOrgSlug?: string;
  // Service layer: require at least one of these, and connect the campus to the org.

  // ---- Core campus fields (no id, createdAt, updatedAt) ----

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

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
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

  // Primary aesthetic descriptors via slugs
  @Field({ nullable: true })
  primaryEnvironmentSlug?: string; // maps to Environment.slug

  @Field({ nullable: true })
  primarySettingStyleSlug?: string; // maps to SettingStyle.slug

  @Field({ nullable: true })
  primaryLuxuryTierSlug?: string; // maps to LuxuryTier.slug

  // ---- Nested connects / connectOrCreate for vocab + content ----

  @Field(() => [AmenityConnectOrCreateInput], { nullable: true })
  amenities?: AmenityConnectOrCreateInput[];

  @Field(() => [LanguageConnectOrCreateInput], { nullable: true })
  languages?: LanguageConnectOrCreateInput[];

  @Field(() => [PopulationConnectOrCreateInput], { nullable: true })
  populations?: PopulationConnectOrCreateInput[];

  @Field(() => [EnvironmentConnectOrCreateInput], { nullable: true })
  environments?: EnvironmentConnectOrCreateInput[];

  @Field(() => [SettingStyleConnectOrCreateInput], { nullable: true })
  settingStyles?: SettingStyleConnectOrCreateInput[];

  @Field(() => [LuxuryTierConnectOrCreateInput], { nullable: true })
  luxuryTiers?: LuxuryTierConnectOrCreateInput[];

  @Field(() => [CampusReviewCreateInput], { nullable: true })
  reviews?: CampusReviewCreateInput[];

  @Field(() => [CampusTestimonialCreateInput], { nullable: true })
  testimonials?: CampusTestimonialCreateInput[];

  @Field(() => [CampusStoryCreateInput], { nullable: true })
  stories?: CampusStoryCreateInput[];

  // Note: insurancePayers / paymentOptions can be added later with their own
  // connectOrCreate inputs if you want to bootstrap them at campus level.

  @Field(() => [SocialMediaProfileConnectOrCreateInput], { nullable: true })
  socialMediaProfiles?: SocialMediaProfileConnectOrCreateInput[];
}

// ------------------------------------------------------
// CreateRehabProgramInput
// ------------------------------------------------------

@InputType()
export class CreateRehabProgramInput {
  // ---- Parent campus reference (connect only) ----

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  campusSlug?: string;
  // Service layer: require at least one to connect the program to a campus.

  // ---- Level of care reference ----
  // For programs, you usually want to connect to an existing LevelOfCare
  // by slug, not create new ones at this layer.

  @Field()
  levelOfCareSlug!: string;

  // ---- Core program fields (no id, createdAt, updatedAt) ----

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  shortName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  targetPopulationSummary?: string;

  @Field({ nullable: true })
  clinicalFocusSummary?: string;

  @Field(() => Int, { nullable: true })
  minLengthOfStayDays?: number;

  @Field(() => Int, { nullable: true })
  maxLengthOfStayDays?: number;

  @Field(() => Int, { nullable: true })
  typicalLengthOfStayDays?: number;

  @Field({ nullable: true })
  sessionScheduleSummary?: string; // "Mon–Fri evenings", etc.

  @Field(() => [String], { nullable: true })
  checkInDays?: string[]; // ["MONDAY","WEDNESDAY"]

  @Field({ nullable: true })
  intakePhone?: string;

  @Field({ nullable: true })
  intakeEmail?: string;

  @Field({ nullable: true })
  isDetoxPrimary?: boolean;

  @Field({ nullable: true })
  isMATProgram?: boolean;

  @Field({ nullable: true })
  hasOnsiteMD?: boolean;

  @Field({ nullable: true })
  hasTwentyFourHourNursing?: boolean;

  @Field(() => Float, { nullable: true })
  staffToPatientRatio?: number;

  @Field({ nullable: true })
  acceptsSelfReferral?: boolean;

  @Field({ nullable: true })
  acceptsCourtOrdered?: boolean;

  @Field({ nullable: true })
  acceptsMedicallyComplex?: boolean;

  @Field(() => WaitlistCategory, { nullable: true })
  waitlistCategory?: WaitlistCategory;

  @Field({ nullable: true })
  waitlistDescription?: string;

  // ---- Nested connects / connectOrCreate for vocab + content ----

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

  @Field(() => [ProgramFeatureGlobalConnectOrCreateInput], { nullable: true })
  features?: ProgramFeatureGlobalConnectOrCreateInput[];

  @Field(() => [MATTypeConnectOrCreateInput], { nullable: true })
  matTypes?: MATTypeConnectOrCreateInput[];

  @Field(() => [SubstanceConnectOrCreateInput], { nullable: true })
  substances?: SubstanceConnectOrCreateInput[];

  @Field(() => [ProgramReviewCreateInput], { nullable: true })
  reviews?: ProgramReviewCreateInput[];

  @Field(() => [ProgramTestimonialCreateInput], { nullable: true })
  testimonials?: ProgramTestimonialCreateInput[];

  @Field(() => [ProgramStoryCreateInput], { nullable: true })
  stories?: ProgramStoryCreateInput[];
}
