import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InsuranceProviderGQL {
  @Field(() => Int)
  id!: number;
  @Field() payer_code!: string;
  @Field() payer_name!: string;
  @Field({ nullable: true }) type?: string | null;
  @Field({ nullable: true }) eligibility?: string | null;
}

@InputType()
export class CreateInsuranceProviderInput {
  @Field() payer_code!: string;
  @Field() payer_name!: string;
  @Field({ nullable: true }) type?: string;
  @Field({ nullable: true }) eligibility?: string;
}

@InputType()
export class UpdateInsuranceProviderInput {
  @Field({ nullable: true }) payer_name?: string;
  @Field({ nullable: true }) type?: string;
  @Field({ nullable: true }) eligibility?: string;
}
