import { Module } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import { GraphqlClientService } from './graphql-client.service';

@Module({
  providers: [
    {
      // Use the GraphQLClient class itself as the DI token
      provide: GraphQLClient,
      useFactory: () => {
        const endpoint =
          process.env.REHAB_GRAPHQL_URL ?? 'http://localhost:4001/graphql';

        return new GraphQLClient(endpoint, {
          // headers: { authorization: `Bearer ${...}` }, // later if needed
        });
      },
    },
    GraphqlClientService,
  ],
  exports: [GraphqlClientService],
})
export class GraphqlClientModule {}
