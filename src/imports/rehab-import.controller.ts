import {
  Controller,
  Post,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import type { CreateRehabOrgInput } from 'src/graphql_sdk/graphql';

import { RehabOrgEnrichmentJSON } from './rehab-org.import.interface';
import { mapRehabOrgEnrichmentJsonToCreateRehabOrgInput } from './rehab-org.import.mapper';

@Controller('rehabs')
export class RehabImportController {
  constructor(private readonly gqlClient: GraphqlClientService) {}

  @Post('rehab-org-upload-json')
  async uploadRehabOrgJson(@Req() req: FastifyRequest) {
    try {
      // -----------------------------
      // 1. Grab uploaded file
      // -----------------------------
      const file = await req.file();

      if (!file) {
        throw new HttpException(
          {
            success: false,
            error: 'No file uploaded. Expecting a "file" field.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // -----------------------------
      // 2. Stream file → Buffer
      // -----------------------------
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) {
        chunks.push(chunk as Buffer);
      }

      const rawText = Buffer.concat(chunks).toString('utf8');

      // -----------------------------
      // 3. Parse JSON
      // -----------------------------
      let parsed: RehabOrgEnrichmentJSON | null;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid JSON uploaded.',
            details: String(err),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // -----------------------------
      // 4. Map + sanitize to GraphQL Input
      // -----------------------------
      let input: CreateRehabOrgInput;
      try {
        input = mapRehabOrgEnrichmentJsonToCreateRehabOrgInput(parsed);
      } catch (err) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid data shape. Mapping failed.',
            details: String(err),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // -----------------------------
      // 5. Call GraphQL mutation
      // -----------------------------
      const result =
        await this.gqlClient.createRehabOrgWithConnectOrCreate(input);

      return {
        success: true,
        message: 'Rehab org imported successfully.',
        data: result,
      };
    } catch (err) {
      console.error('Error during import:', err);

      // If already HttpException, rethrow to NestJS
      if (err instanceof HttpException) {
        throw err;
      }

      // Unexpected error → 500
      throw new HttpException(
        {
          success: false,
          error: 'Unexpected server error.',
          details: String(err),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
