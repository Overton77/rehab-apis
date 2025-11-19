// src/rehabs/models/lookups.model.ts
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
// import { RehabProgram } from './common.enums';
import { LevelOfCareType as LevelOfCareTypeGql } from './common.enums';
import { $Enums } from 'prisma/generated/client';

// You’ll also import join models where needed;
// for now I just refer to them by name.

@ObjectType()
export class LevelOfCare {
  @Field(() => ID)
  id!: string;

  @Field(() => LevelOfCareTypeGql)
  type!: $Enums.LevelOfCareType;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;

  // relations
}

@ObjectType()
export class DetoxService {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class MATType {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  medicationClass?: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Service {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Population {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Accreditation {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Language {
  @Field(() => ID)
  id!: string;

  @Field()
  code!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Amenity {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class Environment {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class SettingStyle {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class LuxuryTier {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field(() => Int, { nullable: true })
  rank?: number;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class ProgramFeature {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class PaymentOption {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class InsurancePayer {
  @Field(() => ID)
  id!: string;

  @Field()
  companyName!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  payerType?: string;
}

@ObjectType()
export class Substance {
  @Field(() => ID)
  id!: string;

  @Field()
  slug!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;
}
