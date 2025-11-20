import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { LevelOfCareType } from './common.enums';

// ---------- LevelOfCare ----------
@InputType()
export class LevelOfCareCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field(() => LevelOfCareType, { nullable: true })
  type?: LevelOfCareType; // defaults to OTHER in Prisma if omitted

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class LevelOfCareCreateManyInput {
  @Field(() => [LevelOfCareCreateInput])
  items: LevelOfCareCreateInput[];
}

// ---------- DetoxService ----------
@InputType()
export class DetoxServiceCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class DetoxServiceCreateManyInput {
  @Field(() => [DetoxServiceCreateInput])
  items: DetoxServiceCreateInput[];
}

// ---------- MATType ----------
@InputType()
export class MATTypeCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  medicationClass?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class MATTypeCreateManyInput {
  @Field(() => [MATTypeCreateInput])
  items: MATTypeCreateInput[];
}

// ---------- Service ----------
@InputType()
export class ServiceCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ServiceCreateManyInput {
  @Field(() => [ServiceCreateInput])
  items: ServiceCreateInput[];
}

// ---------- Population ----------
@InputType()
export class PopulationCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class PopulationCreateManyInput {
  @Field(() => [PopulationCreateInput])
  items: PopulationCreateInput[];
}

// ---------- Accreditation ----------
@InputType()
export class AccreditationCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class AccreditationCreateManyInput {
  @Field(() => [AccreditationCreateInput])
  items: AccreditationCreateInput[];
}

// ---------- Language ----------
@InputType()
export class LanguageCreateInput {
  @Field()
  code: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class LanguageCreateManyInput {
  @Field(() => [LanguageCreateInput])
  items: LanguageCreateInput[];
}

// ---------- Amenity ----------
@InputType()
export class AmenityCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class AmenityCreateManyInput {
  @Field(() => [AmenityCreateInput])
  items: AmenityCreateInput[];
}

// ---------- Environment ----------
@InputType()
export class EnvironmentCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class EnvironmentCreateManyInput {
  @Field(() => [EnvironmentCreateInput])
  items: EnvironmentCreateInput[];
}

// ---------- SettingStyle ----------
@InputType()
export class SettingStyleCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class SettingStyleCreateManyInput {
  @Field(() => [SettingStyleCreateInput])
  items: SettingStyleCreateInput[];
}

// ---------- LuxuryTier ----------
@InputType()
export class LuxuryTierCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field(() => Int, { nullable: true })
  rank?: number;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class LuxuryTierCreateManyInput {
  @Field(() => [LuxuryTierCreateInput])
  items: LuxuryTierCreateInput[];
}

// ---------- ProgramFeature ----------
@InputType()
export class ProgramFeatureCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class ProgramFeatureCreateManyInput {
  @Field(() => [ProgramFeatureCreateInput])
  items: ProgramFeatureCreateInput[];
}

// ---------- PaymentOption ----------
@InputType()
export class PaymentOptionCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class PaymentOptionCreateManyInput {
  @Field(() => [PaymentOptionCreateInput])
  items: PaymentOptionCreateInput[];
}

// ---------- InsurancePayer ----------
@InputType()
export class InsurancePayerCreateInput {
  @Field()
  companyName: string;

  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  payerType?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class InsurancePayerCreateManyInput {
  @Field(() => [InsurancePayerCreateInput])
  items: InsurancePayerCreateInput[];
}

// ---------- Substance ----------
@InputType()
export class SubstanceCreateInput {
  @Field()
  slug: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class SubstanceCreateManyInput {
  @Field(() => [SubstanceCreateInput])
  items: SubstanceCreateInput[];
}
