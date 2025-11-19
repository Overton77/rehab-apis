// src/rehabs/dto/rehab-upsert.inputs.ts
import { Field, InputType, Int, Float } from '@nestjs/graphql';

import {
  // Org + shared helpers

  PopulationConnectOrCreateInput,
  LanguageConnectOrCreateInput,
  AmenityConnectOrCreateInput,
  EnvironmentConnectOrCreateInput,
  SettingStyleConnectOrCreateInput,
  LuxuryTierConnectOrCreateInput,
  SocialMediaProfileConnectOrCreateInput,
  RehabInsurancePayerConnectOrCreateInput,
  RehabPaymentOptionConnectOrCreateInput,
} from './rehab-org-create.input';

import {
  // Campus / Program helpers

  CampusReviewCreateInput,
  CampusTestimonialCreateInput,
  CampusStoryCreateInput,
} from './rehab-program-create.input';

// ---------------------------------------------------------------------

@InputType()
export class UpsertRehabCampusInput {
  // ---------- WHERE ----------
  @Field()
  id!: string;

  // ---- Parent org reference (connect only) ----

  @Field({ nullable: true })
  rehabOrgId?: string;

  @Field({ nullable: true })
  rehabOrgSlug?: string;

  // ---- Core campus fields (all optional) ----

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  country?: string;

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

  @Field(() => [SocialMediaProfileConnectOrCreateInput], {
    nullable: true,
  })
  socialMediaProfiles?: SocialMediaProfileConnectOrCreateInput[];

  @Field(() => [RehabInsurancePayerConnectOrCreateInput], {
    nullable: true,
  })
  insurancePayers?: RehabInsurancePayerConnectOrCreateInput[];

  @Field(() => [RehabPaymentOptionConnectOrCreateInput], {
    nullable: true,
  })
  paymentOptions?: RehabPaymentOptionConnectOrCreateInput[];
}
