// src/rehabs/models/content.model.ts
import {
  Field,
  ID,
  Int,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

import {
  ReviewSource as ReviewSourceGql,
  ReviewerType as ReviewerTypeGql,
  StoryType as StoryTypeGql,
} from './common.enums';
import { $Enums } from 'prisma/generated/client';
// ---------- Org-level ----------

@ObjectType()
export class OrgReview {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabOrgId!: string;

  @Field(() => Int)
  rating!: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  body!: string;

  @Field(() => ReviewerTypeGql)
  reviewerType!: $Enums.ReviewerType;

  @Field({ nullable: true })
  reviewerName?: string;

  @Field({ nullable: true })
  reviewerRole?: string;

  @Field(() => ReviewSourceGql)
  source!: $Enums.ReviewSource;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field()
  isFeatured!: boolean;

  @Field()
  isVerified!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class OrgTestimonial {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabOrgId!: string;

  @Field()
  quote!: string;

  @Field({ nullable: true })
  attributionName?: string;

  @Field({ nullable: true })
  attributionRole?: string;

  @Field({ nullable: true })
  source?: string;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class OrgStory {
  @Field(() => ID)
  id!: string;

  @Field()
  rehabOrgId!: string;

  @Field(() => StoryTypeGql)
  storyType!: $Enums.StoryType;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  summary?: string;

  @Field()
  body!: string;

  @Field(() => [String])
  tags!: string[];

  @Field()
  isPublic!: boolean;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

// ---------- Campus-level ----------

@ObjectType()
export class CampusReview {
  @Field(() => ID)
  id!: string;

  @Field()
  campusId!: string;

  @Field(() => Int)
  rating!: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  body!: string;

  @Field(() => ReviewerTypeGql)
  reviewerType!: $Enums.ReviewerType;

  @Field({ nullable: true })
  reviewerName?: string;

  @Field({ nullable: true })
  reviewerRole?: string;

  @Field(() => ReviewSourceGql)
  source!: $Enums.ReviewSource;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field()
  isFeatured!: boolean;

  @Field()
  isVerified!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class CampusTestimonial {
  @Field(() => ID)
  id!: string;

  @Field()
  campusId!: string;

  @Field()
  quote!: string;

  @Field({ nullable: true })
  attributionName?: string;

  @Field({ nullable: true })
  attributionRole?: string;

  @Field({ nullable: true })
  source?: string;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class CampusStory {
  @Field(() => ID)
  id!: string;

  @Field()
  campusId!: string;

  @Field(() => StoryTypeGql)
  storyType!: $Enums.StoryType;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  summary?: string;

  @Field()
  body!: string;

  @Field(() => [String])
  tags!: string[];

  @Field()
  isPublic!: boolean;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

// ---------- Program-level ----------

@ObjectType()
export class ProgramReview {
  @Field(() => ID)
  id!: string;

  @Field()
  programId!: string;

  @Field(() => Int)
  rating!: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  body!: string;

  @Field(() => ReviewerTypeGql)
  reviewerType!: $Enums.ReviewerType;

  @Field({ nullable: true })
  reviewerName?: string;

  @Field({ nullable: true })
  reviewerRole?: string;

  @Field(() => ReviewSourceGql)
  source!: $Enums.ReviewSource;

  @Field({ nullable: true })
  externalUrl?: string;

  @Field()
  isFeatured!: boolean;

  @Field()
  isVerified!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class ProgramTestimonial {
  @Field(() => ID)
  id!: string;

  @Field()
  programId!: string;

  @Field()
  quote!: string;

  @Field({ nullable: true })
  attributionName?: string;

  @Field({ nullable: true })
  attributionRole?: string;

  @Field({ nullable: true })
  source?: string;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class ProgramStory {
  @Field(() => ID)
  id!: string;

  @Field()
  programId!: string;

  @Field(() => StoryTypeGql)
  storyType!: $Enums.StoryType;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  summary?: string;

  @Field()
  body!: string;

  @Field(() => [String])
  tags!: string[];

  @Field()
  isPublic!: boolean;

  @Field()
  isFeatured!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
