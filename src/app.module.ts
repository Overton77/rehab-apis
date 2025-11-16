import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppResolver } from './app.resolver';
import { PrismaService } from './prisma.service';
import { InsuranceProvidersModule } from './insurance-providers/insurance-providers.module';
import { ProspectiveRehabsModule } from './prospective-rehabs/prospective-rehabs.module';
import { GraphqlClientModule } from './graphql-client/graphql-client.module';
import { RehabModule } from './rehabs/rehab.module';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

// NEW imports for Redis via Keyv
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    // Load env (so REDIS_URL, etc. are available)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ---------- CACHING (in-memory + Redis) ----------
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService): CacheModuleOptions => {
        const redisUrl =
          config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';

        return {
          // Default TTL for cache entries (ms)
          ttl: 5 * 60 * 1000, // 5 minutes

          // Multiple stores, as in Nest docs:
          // 1. Fast in-memory L1 cache
          // 2. Redis L2 cache
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: 60_000, // 1 minute in memory
                lruSize: 5_000,
              }),
            }),
            new KeyvRedis(redisUrl),
          ],
        } as CacheModuleOptions;
      },
    }),

    // ---------- GRAPHQL ----------
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
    RehabModule,
    GraphqlClientModule,
  ],
  providers: [AppResolver, PrismaService],
})
export class AppModule {}
