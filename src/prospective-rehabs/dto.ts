import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProspectiveRehab {
  @Field(() => Int)
  id!: number;

  @Field()
  npi_number!: string;

  @Field()
  organization_name!: string;

  @Field({ nullable: true }) address?: string | null;
  @Field({ nullable: true }) city?: string | null;
  @Field({ nullable: true }) state?: string | null;
  @Field({ nullable: true }) postal_code?: string | null;
  @Field({ nullable: true }) phone?: string | null;
  @Field({ nullable: true }) taxonomy_code?: string | null;
  @Field({ nullable: true }) taxonomy_desc?: string | null;

  // Let Nest infer the DateTime scalar from Date
  @Field(() => Date, { nullable: true })
  last_updated?: Date | null;

  @Field()
  ingested!: boolean;
}

@InputType()
export class CreateProspectiveRehabInput {
  @Field()
  npi_number!: string;

  @Field()
  organization_name!: string;

  @Field({ nullable: true }) address?: string;
  @Field({ nullable: true }) city?: string;
  @Field({ nullable: true }) state?: string;
  @Field({ nullable: true }) postal_code?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) taxonomy_code?: string;
  @Field({ nullable: true }) taxonomy_desc?: string;

  @Field(() => Date, { nullable: true })
  last_updated?: Date;

  @Field({ defaultValue: false })
  ingested?: boolean;
}

@InputType()
export class UpdateProspectiveRehabInput {
  @Field({ nullable: true }) organization_name?: string;
  @Field({ nullable: true }) address?: string;
  @Field({ nullable: true }) city?: string;
  @Field({ nullable: true }) state?: string;
  @Field({ nullable: true }) postal_code?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) taxonomy_code?: string;
  @Field({ nullable: true }) taxonomy_desc?: string;

  @Field(() => Date, { nullable: true })
  last_updated?: Date;

  @Field({ nullable: true })
  ingested?: boolean;
}
