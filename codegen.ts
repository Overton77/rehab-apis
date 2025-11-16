import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Your generated schema (from Nest) lives here
  schema: './schema.graphql',

  // Where your .graphql operations live
  documents: './src/codegen_operations/**/*.graphql',

  generates: {
    './src/graphql_sdk/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request', // gives you getSdk(...)
      ],
    },
  },

  // Map custom scalars to TS types
  config: {
    scalars: {
      DateTime: 'string',
      JSON: 'Record<string, unknown>',
      // add others if you have them (e.g. UUID, Decimal, etc.)
    },
    // Optional: avoid name conflicts with __typename
    skipTypename: false,
    nonOptionalTypename: true,
  },
};

export default config;
