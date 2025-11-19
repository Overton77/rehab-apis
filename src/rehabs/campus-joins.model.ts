// src/rehabs/models/campus-joins.model.ts
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Language,
  Population,
  Amenity,
  Environment,
  SettingStyle,
  LuxuryTier,
} from './lookups.model';

@ObjectType()
export class RehabCampusAmenity {
  @Field()
  campusId!: string;

  @Field()
  amenityId!: string;

  @Field(() => Amenity, { nullable: true })
  amenity?: Amenity;
}

@ObjectType()
export class RehabCampusLanguage {
  @Field()
  campusId!: string;

  @Field()
  languageId!: string;

  @Field(() => Language, { nullable: true })
  language?: Language;
}

@ObjectType()
export class RehabCampusPopulation {
  @Field()
  campusId!: string;

  @Field()
  populationId!: string;

  @Field(() => Population, { nullable: true })
  population?: Population;
}

@ObjectType()
export class RehabCampusEnvironment {
  @Field()
  campusId!: string;

  @Field()
  environmentId!: string;

  @Field(() => Environment, { nullable: true })
  environment?: Environment;
}

@ObjectType()
export class RehabCampusSettingStyle {
  @Field()
  campusId!: string;

  @Field()
  settingStyleId!: string;

  @Field(() => SettingStyle, { nullable: true })
  settingStyle?: SettingStyle;
}

@ObjectType()
export class RehabCampusLuxuryTier {
  @Field()
  campusId!: string;

  @Field()
  luxuryTierId!: string;

  @Field(() => LuxuryTier, { nullable: true })
  luxuryTier?: LuxuryTier;
}
