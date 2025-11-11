import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { PrismaService } from './prisma.service';
import { InsuranceProvidersModule } from './insurance-providers/insurance-providers.module';
import { ProspectiveRehabsModule } from './prospective-rehabs/prospective-rehabs.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.graphql'),
      sortSchema: true,
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    InsuranceProvidersModule,
    ProspectiveRehabsModule,
  ],
  providers: [AppResolver, PrismaService],
})
export class AppModule {}
