import { Injectable } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { getSdk } from 'src/graphql_sdk/graphql';
import {
  CreateRehabOrgInput,
  CreateRehabOrgWithConnectOrCreateMutation,
} from 'src/graphql_sdk/graphql';

@Injectable()
export class GraphqlClientService {
  private readonly sdk = getSdk(this.client);

  // This param type is a real class (GraphQLClient), so Nest can use it as a token
  constructor(private readonly client: GraphQLClient) {}

  async createRehabOrgWithConnectOrCreate(
    data: CreateRehabOrgInput,
  ): Promise<CreateRehabOrgWithConnectOrCreateMutation> {
    const rehabOrg = await this.sdk.CreateRehabOrgWithConnectOrCreate({ data });

    return rehabOrg;
  }
}
