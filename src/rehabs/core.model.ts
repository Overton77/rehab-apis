import {
  Field,
  ID,
  Int,
  Float,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

import { WaitlistCategory as WaitlistCategoryGql } from './common.enums';
import { $Enums } from 'prisma/generated/client';

import {
  LevelOfCare,
  Environment,
  SettingStyle,
  LuxuryTier,
} from './lookups.model';

import {
  RehabLevelOfCare,
  RehabDetoxService,
  RehabService,
  RehabPopulation,
  RehabAccreditation,
  RehabLanguage,
  RehabAmenity,
  RehabEnvironment,
  RehabSettingStyle,
  RehabLuxuryTier,
  RehabProgramFeatureGlobal,
} from './rehab-joins.model';

import {
  RehabCampusAmenity,
  RehabCampusLanguage,
  RehabCampusPopulation,
  RehabCampusEnvironment,
  RehabCampusSettingStyle,
  RehabCampusLuxuryTier,
} from './campus-joins.model';

import {
  RehabProgramDetoxService,
  RehabProgramService,
  RehabProgramPopulation,
  RehabProgramLanguage,
  RehabProgramAmenity,
  RehabProgramFeature,
  RehabProgramMATType,
  RehabProgramSubstance,
} from './program-joins.model';

import { RehabInsurancePayer, RehabPaymentOption } from './finance.model';

import {
  OrgReview,
  OrgTestimonial,
  OrgStory,
  CampusReview,
  CampusTestimonial,
  CampusStory,
  ProgramReview,
  ProgramTestimonial,
  ProgramStory,
} from './content.model';

// ------------------------------------------------------
// ParentCompany & media
// ------------------------------------------------------

@ObjectType()
export class YoutubeVideo {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  channelId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field()
  url!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class YoutubeChannel {
  @Field(() => ID)
  id!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  parentCompanyId?: string;

  @Field({ nullable: true })
  rehabOrgId?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [YoutubeVideo], { nullable: true })
  videos?: YoutubeVideo[];
}

@ObjectType()
export class SocialMediaProfile {
  @Field(() => ID)
  id!: string;

  @Field()
  platform!: string;

  @Field()
  url!: string;

  @Field({ nullable: true })
  parentCompanyId?: string;

  @Field({ nullable: true })
  rehabOrgId?: string;

  @Field({ nullable: true })
  rehabCampusId?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class ParentCompany {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field({ nullable: true })
  heroImageUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  verifiedExists!: boolean;

  @Field({ nullable: true })
  headquartersStreet?: string;

  @Field({ nullable: true })
  headquartersCity?: string;

  @Field({ nullable: true })
  headquartersState?: string;

  @Field({ nullable: true })
  headquartersPostalCode?: string;

  @Field({ nullable: true })
  headquartersCountry?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [YoutubeChannel], { nullable: true })
  youtubeChannels?: YoutubeChannel[];

  @Field(() => [SocialMediaProfile], { nullable: true })
  socialMediaProfiles?: SocialMediaProfile[];

  @Field(() => [RehabOrg], { nullable: true })
  rehabOrgs?: RehabOrg[];
}

// ------------------------------------------------------
// RehabOrg (brand-level org)
// ------------------------------------------------------

@ObjectType()
export class RehabOrg {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  parentCompanyId?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  heroImageUrl?: string;

  @Field({ nullable: true })
  galleryImageUrls?: string[];

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

  @Field()
  verifiedExists!: boolean;

  @Field({ nullable: true })
  primarySourceUrl?: string;

  @Field(() => [String])
  otherSourceUrls!: string[];

  @Field({ nullable: true })
  baseCurrency?: string;

  @Field(() => Int, { nullable: true })
  fullPrivatePrice?: number;

  @Field({ nullable: true })
  defaultTimeZone?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  // Relations

  @Field(() => ParentCompany, { nullable: true })
  parentCompany?: ParentCompany;

  @Field(() => [RehabCampus], { nullable: true })
  campuses?: RehabCampus[];

  // Org-level flags / lookups

  @Field(() => [RehabAccreditation], { nullable: true })
  orgAccreditations?: RehabAccreditation[];

  @Field(() => [OrgReview], { nullable: true })
  orgReviews?: OrgReview[];

  @Field(() => [OrgTestimonial], { nullable: true })
  orgTestimonials?: OrgTestimonial[];

  @Field(() => [OrgStory], { nullable: true })
  orgStories?: OrgStory[];

  @Field(() => [RehabInsurancePayer], { nullable: true })
  insurancePayers?: RehabInsurancePayer[];

  @Field(() => [RehabPaymentOption], { nullable: true })
  paymentOptions?: RehabPaymentOption[];

  @Field(() => [RehabLevelOfCare], { nullable: true })
  levelsOfCare?: RehabLevelOfCare[];

  @Field(() => [RehabDetoxService], { nullable: true })
  detoxServices?: RehabDetoxService[];

  @Field(() => [RehabService], { nullable: true })
  services?: RehabService[];

  @Field(() => [RehabPopulation], { nullable: true })
  populations?: RehabPopulation[];

  @Field(() => [RehabLanguage], { nullable: true })
  languages?: RehabLanguage[];

  @Field(() => [RehabAmenity], { nullable: true })
  amenities?: RehabAmenity[];

  @Field(() => [RehabEnvironment], { nullable: true })
  environments?: RehabEnvironment[];

  @Field(() => [RehabSettingStyle], { nullable: true })
  settingStyles?: RehabSettingStyle[];

  @Field(() => [RehabLuxuryTier], { nullable: true })
  luxuryTiers?: RehabLuxuryTier[];

  @Field(() => [RehabProgramFeatureGlobal], { nullable: true })
  programFeaturesGlobal?: RehabProgramFeatureGlobal[];

  @Field(() => [YoutubeChannel], { nullable: true })
  youtubeChannels?: YoutubeChannel[];

  @Field(() => [SocialMediaProfile], { nullable: true })
  socialMediaProfiles?: SocialMediaProfile[];
}

// ------------------------------------------------------
// RehabCampus (physical locations)
// ------------------------------------------------------

@ObjectType()
export class RehabCampus {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabOrgId!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  heroImageUrl?: string;

  @Field({ nullable: true })
  galleryImageUrls?: string[];

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

  @Field({ nullable: true })
  primaryEnvironmentId?: string;

  @Field({ nullable: true })
  primarySettingStyleId?: string;

  @Field({ nullable: true })
  primaryLuxuryTierId?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  // Relations

  @Field(() => RehabOrg, { nullable: true })
  rehabOrg?: RehabOrg;

  @Field(() => Environment, { nullable: true })
  primaryEnvironment?: Environment;

  @Field(() => SettingStyle, { nullable: true })
  primarySettingStyle?: SettingStyle;

  @Field(() => LuxuryTier, { nullable: true })
  primaryLuxuryTier?: LuxuryTier;

  @Field(() => [RehabProgram], { nullable: true })
  programs?: RehabProgram[];

  @Field(() => [RehabCampusAmenity], { nullable: true })
  campusAmenities?: RehabCampusAmenity[];

  @Field(() => [RehabCampusLanguage], { nullable: true })
  campusLanguages?: RehabCampusLanguage[];

  @Field(() => [RehabCampusPopulation], { nullable: true })
  campusPopulations?: RehabCampusPopulation[];

  @Field(() => [RehabCampusEnvironment], { nullable: true })
  campusEnvironments?: RehabCampusEnvironment[];

  @Field(() => [RehabCampusSettingStyle], { nullable: true })
  campusSettingStyles?: RehabCampusSettingStyle[];

  @Field(() => [RehabCampusLuxuryTier], { nullable: true })
  campusLuxuryTiers?: RehabCampusLuxuryTier[];

  @Field(() => [CampusReview], { nullable: true })
  campusReviews?: CampusReview[];

  @Field(() => [CampusTestimonial], { nullable: true })
  campusTestimonials?: CampusTestimonial[];

  @Field(() => [CampusStory], { nullable: true })
  campusStories?: CampusStory[];

  @Field(() => [SocialMediaProfile], { nullable: true })
  socialMediaProfiles?: SocialMediaProfile[];
}

// ------------------------------------------------------
// RehabProgram (actual care tracks)
// ------------------------------------------------------

@ObjectType()
export class RehabProgram {
  @Field(() => ID)
  id!: string;

  @Field()
  campusId!: string;

  @Field()
  levelOfCareId!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  shortName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  heroImageUrl?: string;

  @Field({ nullable: true })
  galleryImageUrls?: string[];

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
  sessionScheduleSummary?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  checkInDays?: string[];

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

  @Field(() => WaitlistCategoryGql)
  waitlistCategory?: $Enums.WaitlistCategory;

  @Field({ nullable: true })
  waitlistDescription?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  // Relations

  @Field(() => RehabCampus)
  campus?: RehabCampus;

  @Field(() => LevelOfCare)
  levelOfCare?: LevelOfCare;

  @Field(() => [RehabProgramDetoxService], { nullable: true })
  programDetoxServices?: RehabProgramDetoxService[];

  @Field(() => [RehabProgramService], { nullable: true })
  programServices?: RehabProgramService[];

  @Field(() => [RehabProgramPopulation], { nullable: true })
  programPopulations?: RehabProgramPopulation[];

  @Field(() => [RehabProgramLanguage], { nullable: true })
  programLanguages?: RehabProgramLanguage[];

  @Field(() => [RehabProgramAmenity], { nullable: true })
  programAmenities?: RehabProgramAmenity[];

  @Field(() => [RehabProgramFeature], { nullable: true })
  programFeatures?: RehabProgramFeature[];

  @Field(() => [RehabProgramMATType], { nullable: true })
  programMATTypes?: RehabProgramMATType[];

  @Field(() => [RehabProgramSubstance], { nullable: true })
  programSubstances?: RehabProgramSubstance[];

  @Field(() => [ProgramReview], { nullable: true })
  programReviews?: ProgramReview[];

  @Field(() => [ProgramTestimonial], { nullable: true })
  programTestimonials?: ProgramTestimonial[];

  @Field(() => [ProgramStory], { nullable: true })
  programStories?: ProgramStory[];
}
