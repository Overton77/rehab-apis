import { Controller, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import type {
  RehabCreateWithLookupsInput,
  SlugRelationInput,
  LanguageRelationInput,
  LuxuryTierRelationInput,
} from 'src/graphql_sdk/graphql';

@Controller('rehabs')
export class RehabImportController {
  constructor(private readonly gqlClient: GraphqlClientService) {}

  @Post('upload-json')
  async uploadJson(@Req() req: FastifyRequest) {
    // 1. Read uploaded file (field name: "file")
    const file = await (req as any).file(); // provided by @fastify/multipart
    if (!file) {
      throw new Error('No file uploaded. Expecting field name "file".');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk as Buffer);
    }
    const jsonString = Buffer.concat(chunks).toString('utf8');

    // 2. Parse JSON
    const raw = JSON.parse(jsonString);
    const rehabsRaw: any[] = Array.isArray(raw) ? raw : [raw];

    // 3. Map JSON → RehabCreateWithLookupsInput[]
    const rehabsInput: RehabCreateWithLookupsInput =
      rehabsRaw.map(mapJsonRehabToInput);

    // 4. Call GraphQL SDK
    const result =
      await this.gqlClient.createRehabWithConnectOrCreate(rehabsInput);

    // 5. Return something simple
    return {
      importedCount: rehabsInput.length,
      result,
    };
  }
}

/**
 * Map one JSON rehab object from your AI file into
 * the RehabCreateWithLookupsInput we designed earlier.
 *
 * Adjust these property names to match your actual JSON schema.
 */
function mapJsonRehabToInput(json: any): RehabCreateWithLookupsInput {
  // Helpers to map arrays safely
  const mapSlugArray = (items?: any[]): SlugRelationInput[] | undefined =>
    items?.map((item) => ({
      slug: item.slug ?? slugify(item.displayName ?? item.name),
      displayName: item.displayName ?? item.name ?? item.slug,
    }));

  const mapLanguages = (items?: any[]): LanguageRelationInput[] | undefined =>
    items?.map((item) => ({
      code: item.code ?? item.slug ?? 'en',
      displayName: item.displayName ?? item.name ?? 'English',
    }));

  const mapLuxuryTiers = (
    items?: any[],
  ): LuxuryTierRelationInput[] | undefined =>
    items?.map((item) => ({
      slug: item.slug ?? slugify(item.displayName ?? item.name),
      displayName: item.displayName ?? item.name ?? item.slug,
      rank: item.rank ?? 1,
    }));

  return {
    // --------------------
    // Core Rehab fields
    // --------------------
    id: json.id,
    name: json.name,
    npi_number: json.npi_number,
    slug: json.slug ?? slugify(json.name),
    description: json.description,
    websiteUrl: json.websiteUrl ?? json.website_url,
    phone: json.phone,
    email: json.email,

    street: json.street ?? json.address?.street,
    city: json.city ?? json.address?.city,
    state: json.state ?? json.address?.state,
    postalCode: json.postalCode ?? json.address?.postalCode,
    country: json.country ?? json.address?.country ?? 'US',

    latitude: json.latitude,
    longitude: json.longitude,

    verifiedExists: json.verifiedExists ?? false,
    primarySourceUrl: json.primarySourceUrl,
    otherSourceUrls: json.otherSourceUrls, // assuming matches your existing input

    fullPrivatePrice: json.fullPrivatePrice,

    createdAt: json.createdAt,
    updatedAt: json.updatedAt,

    // --------------------
    // Relations: all arrays
    // (these line up with RehabCreateWithLookupsInput)
    // --------------------
    insurancePayers: mapSlugArray(json.insurancePayers),
    paymentOptions: mapSlugArray(json.paymentOptions),
    levelsOfCare: mapSlugArray(json.levelsOfCare),
    services: mapSlugArray(json.services),
    detoxServices: mapSlugArray(json.detoxServices),
    populations: mapSlugArray(json.populations),
    accreditations: mapSlugArray(json.accreditations),
    languages: mapLanguages(json.languages),
    amenities: mapSlugArray(json.amenities),
    environments: mapSlugArray(json.environments),
    settingStyles: mapSlugArray(json.settingStyles),
    luxuryTiers: mapLuxuryTiers(json.luxuryTiers),
    programFeatures: mapSlugArray(json.programFeatures),
  };
}

// Very basic slugify for default slugs when the AI only gives a name
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
