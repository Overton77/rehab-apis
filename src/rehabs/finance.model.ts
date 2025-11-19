// src/rehabs/models/finance.model.ts
import {
  Field,
  ID,
  Int,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

import {
  InsuranceScope as InsuranceScopeGql,
  NetworkStatus as NetworkStatusGql,
} from './common.enums';
// import { RehabOrg, RehabCampus, RehabProgram } from './common.enums';
import { InsurancePayer, PaymentOption } from './lookups.model';
import { RehabOrg, RehabCampus, RehabProgram } from './core.model';
import { $Enums } from 'prisma/generated/client';

@ObjectType()
export class RehabInsurancePayer {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabId!: string;

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  programId?: string;

  @Field()
  insurancePayerId!: string;

  @Field(() => InsuranceScopeGql)
  scope!: $Enums.InsuranceScope;

  @Field(() => NetworkStatusGql)
  networkStatus!: $Enums.NetworkStatus;

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

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => RehabOrg, { nullable: true })
  rehab?: RehabOrg;

  @Field(() => RehabCampus, { nullable: true })
  campus?: RehabCampus;

  @Field(() => RehabProgram, { nullable: true })
  program?: RehabProgram;

  @Field(() => InsurancePayer, { nullable: true })
  insurancePayer?: InsurancePayer;
}

@ObjectType()
export class RehabPaymentOption {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabId!: string;

  @Field({ nullable: true })
  campusId?: string;

  @Field({ nullable: true })
  programId?: string;

  @Field()
  paymentOptionId!: string;

  @Field({ nullable: true })
  descriptionOverride?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => RehabOrg, { nullable: true })
  rehab?: RehabOrg;

  @Field(() => RehabCampus, { nullable: true })
  campus?: RehabCampus;

  @Field(() => RehabProgram, { nullable: true })
  program?: RehabProgram;

  @Field(() => PaymentOption, { nullable: true })
  paymentOption?: PaymentOption;
}
