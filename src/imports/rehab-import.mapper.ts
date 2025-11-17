// src/rehab-import/rehab-import.mapper.ts

import type { RehabCreateWithLookupsInput } from 'src/graphql_sdk/graphql';
import { RehabEnrichmentJson } from './rehab-import.types';

/**
 * Helper function to generate a slug from display name if slug is missing
 */
function generateSlug(displayName: string): string {
  return displayName.toLowerCase().replace(/\s+/g, '-');
}

export function mapJsonRehabToInput(
  json: RehabEnrichmentJson,
): RehabCreateWithLookupsInput {
  const {
    rehab,
    insurancePayers,
    paymentOptions,
    levelsOfCare,
    services,
    detoxServices,
    populations,
    accreditations,
    languages,
    amenities,
    environments,
    settingStyles,
    luxuryTiers,
    programFeatures,
  } = json;

  const input: RehabCreateWithLookupsInput = {
    // --- Core Rehab fields (must match RehabCreateInput) ---
    name: rehab.name,
    slug: rehab.slug,
    npi_number: rehab.npiNumber ?? null,
    description: rehab.description ?? null,
    websiteUrl: rehab.websiteUrl ?? null,
    phone: rehab.phone ?? null,
    email: rehab.email ?? null,

    street: rehab.address.street,
    city: rehab.address.city,
    state: rehab.address.state,
    postalCode: rehab.address.postalCode,
    country: rehab.address.country,

    latitude: rehab.latitude ?? null,
    longitude: rehab.longitude ?? null,
    verifiedExists: rehab.verifiedExists,
    primarySourceUrl: rehab.primarySourceUrl ?? null,
    otherSourceUrls: rehab.otherSourceUrls
      ? { set: rehab.otherSourceUrls }
      : undefined,
    fullPrivatePrice: rehab.fullPrivatePrice ?? null,

    // --- Relations using SlugRelationInput, LanguageRelationInput, LuxuryTierRelationInput ---

    // Insurance payers → SlugRelationInput[]
    insurancePayers: insurancePayers?.map((p) => ({
      slug: p.slug ?? generateSlug(p.displayName),
      displayName: p.displayName,
      ...(p.overview && { overview: p.overview }),
      // NOTE: averageAdmissionPrice, notes, popular are not in SlugRelationInput
    })),

    // Payment options → SlugRelationInput[]
    paymentOptions: paymentOptions?.map((po) => ({
      slug: po.slug ?? generateSlug(po.displayName),
      displayName: po.displayName,
      description: po.description,
    })),

    // Levels of care → SlugRelationInput[]
    levelsOfCare: levelsOfCare?.map((loc) => ({
      slug: loc.slug ?? generateSlug(loc.displayName),
      displayName: loc.displayName,
      description: loc.description,
    })),

    // Services → SlugRelationInput[]
    services: services?.map((s) => ({
      slug: s.slug ?? generateSlug(s.displayName),
      displayName: s.displayName,
      description: s.description,
    })),

    // Detox services → SlugRelationInput[]
    detoxServices: detoxServices?.map((ds) => ({
      slug: ds.slug ?? generateSlug(ds.displayName),
      displayName: ds.displayName,
      description: ds.description,
    })),

    // Populations → SlugRelationInput[]
    populations: populations?.map((p) => ({
      slug: p.slug ?? generateSlug(p.displayName),
      displayName: p.displayName,
      description: p.description,
    })),

    // Accreditations → SlugRelationInput[]
    accreditations: accreditations?.map((a) => ({
      slug: a.slug ?? generateSlug(a.displayName),
      displayName: a.displayName,
      description: a.description,
    })),

    // Languages → LanguageRelationInput[] (uses code instead of slug)
    languages: languages?.map((l) => ({
      code: l.code,
      displayName: l.displayName,
    })),

    // Amenities → SlugRelationInput[]
    amenities: amenities?.map((a) => ({
      slug: a.slug ?? generateSlug(a.displayName),
      displayName: a.displayName,
      description: a.description,
    })),

    // Environments → SlugRelationInput[]
    environments: environments?.map((e) => ({
      slug: e.slug ?? generateSlug(e.displayName),
      displayName: e.displayName,
      description: e.description,
    })),

    // Setting styles → SlugRelationInput[]
    settingStyles: settingStyles?.map((ss) => ({
      slug: ss.slug ?? generateSlug(ss.displayName),
      displayName: ss.displayName,
      description: ss.description,
    })),

    // Luxury tiers → LuxuryTierRelationInput[] (includes rank)
    luxuryTiers: luxuryTiers?.map((lt) => ({
      slug: lt.slug ?? generateSlug(lt.displayName),
      displayName: lt.displayName,
      rank: lt.rank,
      description: lt.description,
    })),

    // Program features → SlugRelationInput[]
    programFeatures: programFeatures?.map((pf) => ({
      slug: pf.slug ?? generateSlug(pf.displayName),
      displayName: pf.displayName,
      description: pf.description,
    })),
  };

  return input;
}
