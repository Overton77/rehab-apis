// src/rehabs/models/rehab-joins.model.ts
import { Field, ObjectType } from '@nestjs/graphql';
import {
  LevelOfCare,
  DetoxService,
  Service,
  Population,
  Accreditation,
  Language,
  Amenity,
  Environment,
  SettingStyle,
  LuxuryTier,
  ProgramFeature,
} from './lookups.model';

@ObjectType()
export class RehabLevelOfCare {
  @Field()
  rehabId!: string;

  @Field()
  levelOfCareId!: string;

  @Field(() => LevelOfCare, { nullable: true })
  levelOfCare?: LevelOfCare;
}

@ObjectType()
export class RehabDetoxService {
  @Field()
  rehabId!: string;

  @Field()
  detoxServiceId!: string;

  @Field(() => DetoxService, { nullable: true })
  detoxService?: DetoxService;
}

@ObjectType()
export class RehabService {
  @Field()
  rehabId!: string;

  @Field()
  serviceId!: string;

  @Field(() => Service, { nullable: true })
  service?: Service;
}

@ObjectType()
export class RehabPopulation {
  @Field()
  rehabId!: string;

  @Field()
  populationId!: string;

  @Field(() => Population, { nullable: true })
  population?: Population;
}

@ObjectType()
export class RehabAccreditation {
  @Field()
  rehabId!: string;

  @Field()
  accreditationId!: string;

  @Field(() => Accreditation, { nullable: true })
  accreditation?: Accreditation;
}

@ObjectType()
export class RehabLanguage {
  @Field()
  rehabId!: string;

  @Field()
  languageId!: string;

  @Field(() => Language, { nullable: true })
  language?: Language;
}

@ObjectType()
export class RehabAmenity {
  @Field()
  rehabId!: string;

  @Field()
  amenityId!: string;

  @Field(() => Amenity, { nullable: true })
  amenity?: Amenity;
}

@ObjectType()
export class RehabEnvironment {
  @Field()
  rehabId!: string;

  @Field()
  environmentId!: string;

  @Field(() => Environment, { nullable: true })
  environment?: Environment;
}

@ObjectType()
export class RehabSettingStyle {
  @Field()
  rehabId!: string;

  @Field()
  settingStyleId!: string;

  @Field(() => SettingStyle, { nullable: true })
  settingStyle?: SettingStyle;
}

@ObjectType()
export class RehabLuxuryTier {
  @Field()
  rehabId!: string;

  @Field()
  luxuryTierId!: string;

  @Field(() => LuxuryTier, { nullable: true })
  luxuryTier?: LuxuryTier;
}

@ObjectType()
export class RehabProgramFeatureGlobal {
  @Field()
  rehabId!: string;

  @Field()
  programFeatureId!: string;

  @Field(() => ProgramFeature, { nullable: true })
  programFeature?: ProgramFeature;
}
