import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { WaitlistCategory } from './common.enums'; // <-- adjust to your actual path

import {
  DetoxServiceConnectOrCreateInput,
  ServiceConnectOrCreateInput,
  PopulationConnectOrCreateInput,
  LanguageConnectOrCreateInput,
  AmenityConnectOrCreateInput,
} from './rehab-org-create.input';

import {
  MATTypeConnectOrCreateInput,
  SubstanceConnectOrCreateInput,
} from './rehab-program-create.input';

import {
  ProgramReviewCreateInput,
  ProgramStoryCreateInput,
  ProgramTestimonialCreateInput,
} from './rehab-program-create.input';

// ------------------------------------------------------
// Vocab connect-or-create inputs (Detox, Service, etc.)
// ------------------------------------------------------

@InputType()
export class ProgramFeatureConnectOrCreateInput {
  @Field({ nullable: true })
  id?: string;

  // Unique slug on ProgramFeature
  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpsertRehabProgramInput {
  // ---------- WHERE ----------
  @Field()
  id!: string;

  // ---- Parent campus reference (connect only) ----

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  campusSlug?: string;

  // ---- Level of care reference ----

  @Field({ nullable: true })
  levelOfCareSlug?: string;

  // ---- Core program fields (all optional) ----

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  slug?: string;

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
  sessionScheduleSummary?: string;

  @Field(() => [String], { nullable: true })
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

  @Field(() => [ProgramFeatureConnectOrCreateInput], {
    nullable: true,
  })
  features?: ProgramFeatureConnectOrCreateInput[];

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
