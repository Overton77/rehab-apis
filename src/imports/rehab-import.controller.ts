import { Controller, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import type {
  RehabCreateWithLookupsInput,
  SlugRelationInput,
  LanguageRelationInput,
  LuxuryTierRelationInput,
} from 'src/graphql_sdk/graphql';
import { RehabEnrichmentJson } from './rehab-import.types';
import { mapJsonRehabToInput } from './rehab-import.mapper';

@Controller('rehabs')
export class RehabImportController {
  constructor(private readonly gqlClient: GraphqlClientService) {}

  @Post('upload-json')
  async uploadJson(@Req() req: FastifyRequest) {
    // 1. Read uploaded file (field name: "file")
    const file = await req.file(); // provided by @fastify/multipart
    if (!file) {
      throw new Error('No file uploaded. Expecting field name "file".');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk as Buffer);
    }
    const jsonString = Buffer.concat(chunks).toString('utf8');

    // 2. Parse JSON
    const raw = JSON.parse(jsonString) as RehabEnrichmentJson;

    console.log(raw);

    const rehabsInput: RehabCreateWithLookupsInput = mapJsonRehabToInput(raw);

    // 4. Call GraphQL SDK
    return await this.gqlClient.createRehabWithConnectOrCreate(rehabsInput);
  }
}
