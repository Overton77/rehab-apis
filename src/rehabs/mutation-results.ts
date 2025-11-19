import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class DeleteResult {
  @Field(() => ID)
  id!: string;
}
