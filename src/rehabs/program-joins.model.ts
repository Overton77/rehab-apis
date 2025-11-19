// src/rehabs/models/program-joins.model.ts
import { Field, ObjectType } from '@nestjs/graphql';
import {
  DetoxService,
  MATType,
  Service,
  Population,
  Language,
  Amenity,
  ProgramFeature,
  Substance,
} from './lookups.model';

@ObjectType()
export class RehabProgramDetoxService {
  @Field()
  programId!: string;

  @Field()
  detoxServiceId!: string;

  @Field(() => DetoxService, { nullable: true })
  detoxService?: DetoxService;
}

@ObjectType()
export class RehabProgramMATType {
  @Field()
  programId!: string;

  @Field()
  matTypeId!: string;

  @Field(() => MATType, { nullable: true })
  matType?: MATType;
}

@ObjectType()
export class RehabProgramService {
  @Field()
  programId!: string;

  @Field()
  serviceId!: string;

  @Field(() => Service, { nullable: true })
  service?: Service;
}

@ObjectType()
export class RehabProgramPopulation {
  @Field()
  programId!: string;

  @Field()
  populationId!: string;

  @Field(() => Population, { nullable: true })
  population?: Population;
}

@ObjectType()
export class RehabProgramLanguage {
  @Field()
  programId!: string;

  @Field()
  languageId!: string;

  @Field(() => Language, { nullable: true })
  language?: Language;
}

@ObjectType()
export class RehabProgramAmenity {
  @Field()
  programId!: string;

  @Field()
  amenityId!: string;

  @Field(() => Amenity, { nullable: true })
  amenity?: Amenity;
}

@ObjectType()
export class RehabProgramFeature {
  @Field()
  programId!: string;

  @Field()
  programFeatureId!: string;

  @Field(() => ProgramFeature, { nullable: true })
  programFeature?: ProgramFeature;
}

@ObjectType()
export class RehabProgramSubstance {
  @Field()
  programId!: string;

  @Field()
  substanceId!: string;

  @Field(() => Substance, { nullable: true })
  substance?: Substance;
}
