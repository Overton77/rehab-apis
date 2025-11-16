import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import {
  getSdk,
  CreateRehabWithConnectOrCreateMutation,
  RehabCreateWithLookupsInput,
  RehabCreateInput as GraphqlRehabCreateInput,
} from 'src/graphql_sdk/graphql';

@Injectable()
export class GraphqlClientService {
  private readonly sdk = getSdk(this.client);

  // This param type is a real class (GraphQLClient), so Nest can use it as a token
  constructor(private readonly client: GraphQLClient) {}

  async createRehabWithConnectOrCreate(
    data: RehabCreateWithLookupsInput,
  ): Promise<CreateRehabWithConnectOrCreateMutation> {
    // adjust to match codegen variable name if needed
    return this.sdk.CreateRehabWithConnectOrCreate({ data });
  }

  async createManyRehabsWithNested(data: GraphqlRehabCreateInput[]) {
    return this.sdk.CreateManyRehabsWithNested({ data });
  }
}
