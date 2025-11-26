// src/rehabs/import/rehab-org-enrichment.mapper.ts

import {
  type CreateRehabOrgInput,
  InsuranceScope as GqlInsuranceScope,
  NetworkStatus as GqlNetworkStatus,
  LevelOfCareType as GqlLevelOfCareType,
  ReviewerType as GqlReviewerType,
  ReviewSource as GqlReviewSource,
  StoryType as GqlStoryType,
} from 'src/graphql_sdk/graphql';

import {
  RehabOrgEnrichmentJSON,
  ParentCompanyEnrichmentJSON,
  RehabCampusCreateForOrgJSON,
  RehabCampusConnectOrCreateJSON,
  LevelOfCareConnectOrCreateJSON,
  DetoxServiceConnectOrCreateJSON,
  ServiceConnectOrCreateJSON,
  PopulationConnectOrCreateJSON,
  AccreditationConnectOrCreateJSON,
  LanguageConnectOrCreateJSON,
  AmenityConnectOrCreateJSON,
  EnvironmentConnectOrCreateJSON,
  SettingStyleConnectOrCreateJSON,
  LuxuryTierConnectOrCreateJSON,
  ProgramFeatureGlobalConnectOrCreateJSON,
  YoutubeChannelConnectOrCreateJSON,
  SocialMediaProfileConnectOrCreateJSON,
  OrgReviewCreateJSON,
  OrgTestimonialCreateJSON,
  OrgStoryCreateJSON,
  RehabInsurancePayerConnectOrCreateJSON,
  RehabPaymentOptionConnectOrCreateJSON,
  InsurancePayerConnectOrCreateJSON,
  PaymentOptionConnectOrCreateJSON,
} from './rehab-org.import.interface';

// ------------------------------------------------------
// Utility Helpers
// ------------------------------------------------------

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const optString = (v: unknown): string | undefined =>
  isNonEmptyString(v) ? v.trim() : undefined;

const reqString = (v: unknown, fieldName: string): string => {
  if (!isNonEmptyString(v)) {
    throw new Error(`Missing required field "${fieldName}"`);
  }
  return v.trim();
};

const optInt = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === '') return undefined;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n as number) ? (n as number) : undefined;
};

const optBool = (v: unknown): boolean | undefined => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const lower = v.toLowerCase().trim();
    if (['true', '1', 'yes', 'y'].includes(lower)) return true;
    if (['false', '0', 'no', 'n'].includes(lower)) return false;
  }
  return undefined;
};

const asArray = <T>(v: T[] | T | undefined | null): T[] | undefined => {
  if (v === null || v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
};

/**
 * Enum coercer that matches by VALUE, ignoring case.
 * Works whether the enum keys are `Detox` or `DETOX`, as long as the values are strings.
 */
const coerceEnum = <T extends string>(
  value: unknown,
  e: Record<string, T>,
): T | undefined => {
  if (typeof value !== 'string') return undefined;
  const upper = value.toUpperCase().trim();
  return (Object.values(e) as T[]).find((v) => v.toUpperCase() === upper);
};

// Safe defaults using the GraphQL enums themselves
const DEFAULT_INSURANCE_SCOPE: GqlInsuranceScope =
  coerceEnum('ORG', GqlInsuranceScope) ??
  (Object.values(GqlInsuranceScope)[0] as GqlInsuranceScope);

const DEFAULT_NETWORK_STATUS: GqlNetworkStatus =
  coerceEnum('UNKNOWN', GqlNetworkStatus) ??
  (Object.values(GqlNetworkStatus)[0] as GqlNetworkStatus);

// ------------------------------------------------------
// Nested Mappers (fully typed)
// ------------------------------------------------------

const mapParentCompany = (
  raw?: ParentCompanyEnrichmentJSON,
): CreateRehabOrgInput['parentCompany'] =>
  raw
    ? {
        id: optString(raw.id),
        slug: optString(raw.slug),
        name: optString(raw.name),
        websiteUrl: optString(raw.websiteUrl),
        description: optString(raw.description),
        verifiedExists: optBool(raw.verifiedExists),
        headquartersCity: optString(raw.headquartersCity),
        headquartersState: optString(raw.headquartersState),
        headquartersCountry: optString(raw.headquartersCountry),
        headquartersPostalCode: optString(raw.headquartersPostalCode),
        headquartersStreet: optString(raw.headquartersStreet),
      }
    : undefined;

const mapRehabCampus = (
  raw: RehabCampusCreateForOrgJSON,
): CreateRehabOrgInput['campuses'][number]['create'] => ({
  name: reqString(raw.name, 'campus.name'),
  slug: reqString(raw.slug, 'campus.slug'),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
  street: reqString(raw.street, 'campus.street'),
  city: reqString(raw.city, 'campus.city'),
  state: reqString(raw.state, 'campus.state'),
  postalCode: reqString(raw.postalCode, 'campus.postalCode'),
  country: reqString(raw.country, 'campus.country'),

  latitude: raw.latitude,
  longitude: raw.longitude,
  phone: optString(raw.phone),
  email: optString(raw.email),
  timeZone: optString(raw.timeZone),
  visitingHours: optString(raw.visitingHours),
  directionsSummary: optString(raw.directionsSummary),

  bedsTotal: optInt(raw.bedsTotal),
  bedsDetox: optInt(raw.bedsDetox),
  bedsResidential: optInt(raw.bedsResidential),
  bedsOutpatientCapacity: optInt(raw.bedsOutpatientCapacity),
  heroImageUrl: optString(raw.heroImageUrl),

  acceptsWalkIns: optBool(raw.acceptsWalkIns),
  hasOnsiteMD: optBool(raw.hasOnsiteMD),
  hasTwentyFourHourNursing: optBool(raw.hasTwentyFourHourNursing),

  primaryEnvironmentSlug: optString(raw.primaryEnvironmentSlug),
  primarySettingStyleSlug: optString(raw.primarySettingStyleSlug),
  primaryLuxuryTierSlug: optString(raw.primaryLuxuryTierSlug),
});

const mapRehabCampusConnectOrCreate = (
  raw: RehabCampusConnectOrCreateJSON,
): CreateRehabOrgInput['campuses'][number] => ({
  id: optString(raw.id),
  slug: optString(raw.slug),
  create: raw.create ? mapRehabCampus(raw.create) : undefined,
});

const mapSimpleSlugRecord = (
  raw:
    | DetoxServiceConnectOrCreateJSON
    | ServiceConnectOrCreateJSON
    | PopulationConnectOrCreateJSON
    | AccreditationConnectOrCreateJSON
    | AmenityConnectOrCreateJSON
    | EnvironmentConnectOrCreateJSON
    | SettingStyleConnectOrCreateJSON
    | ProgramFeatureGlobalConnectOrCreateJSON,
) => ({
  slug: reqString(raw.slug, 'slug'),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
});

const mapLevelOfCare = (
  raw: LevelOfCareConnectOrCreateJSON,
): CreateRehabOrgInput['levelsOfCare'][number] => ({
  slug: reqString(raw.slug, 'levelsOfCare.slug'),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
  // JSON may use your DTO enum or raw strings; we always coerce to the GQL SDK enum
  type: coerceEnum(raw.type, GqlLevelOfCareType),
});

const mapLanguage = (
  raw: LanguageConnectOrCreateJSON,
): CreateRehabOrgInput['languages'][number] => ({
  code: reqString(raw.code, 'languages.code'),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
});

const mapOrgReview = (
  raw: OrgReviewCreateJSON,
): CreateRehabOrgInput['reviews'][number] => ({
  rating: optInt(raw.rating) ?? 0,
  title: optString(raw.title),
  body: reqString(raw.body, 'reviews.body'),
  reviewerType: coerceEnum(raw.reviewerType, GqlReviewerType),
  reviewerName: optString(raw.reviewerName),
  reviewerRole: optString(raw.reviewerRole),
  source: coerceEnum(raw.source, GqlReviewSource),
  externalUrl: optString(raw.externalUrl),
  isFeatured: optBool(raw.isFeatured),
  isVerified: optBool(raw.isVerified),
});

const mapOrgTestimonial = (
  raw: OrgTestimonialCreateJSON,
): CreateRehabOrgInput['testimonials'][number] => ({
  quote: reqString(raw.quote, 'testimonials.quote'),
  attributionName: optString(raw.attributionName),
  attributionRole: optString(raw.attributionRole),
  source: optString(raw.source),
  isFeatured: optBool(raw.isFeatured),
});

const mapOrgStory = (
  raw: OrgStoryCreateJSON,
): CreateRehabOrgInput['stories'][number] => ({
  title: reqString(raw.title, 'stories.title'),
  slug: reqString(raw.slug, 'stories.slug'),
  storyType: coerceEnum(raw.storyType, GqlStoryType),
  summary: optString(raw.summary),
  body: reqString(raw.body, 'stories.body'),
  tags: asArray(raw.tags),
  isPublic: optBool(raw.isPublic),
  isFeatured: optBool(raw.isFeatured),
});

const mapInsurancePayer = (raw: InsurancePayerConnectOrCreateJSON) => ({
  id: optString(raw.id),
  slug: optString(raw.slug),
  companyName: optString(raw.companyName),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
  payerType: optString(raw.payerType),
});

const mapRehabInsurancePayer = (
  raw: RehabInsurancePayerConnectOrCreateJSON,
): CreateRehabOrgInput['insurancePayers'][number] => ({
  insurancePayer: mapInsurancePayer(raw.insurancePayer),

  scope: coerceEnum(raw.scope, GqlInsuranceScope) ?? DEFAULT_INSURANCE_SCOPE,
  networkStatus:
    coerceEnum(raw.networkStatus, GqlNetworkStatus) ?? DEFAULT_NETWORK_STATUS,

  averageAdmissionPrice: optInt(raw.averageAdmissionPrice),
  estimatedPatientOopMin: optInt(raw.estimatedPatientOopMin),
  estimatedPatientOopMax: optInt(raw.estimatedPatientOopMax),

  requiresPreauth: optBool(raw.requiresPreauth),
  acceptsOutOfNetworkWithOopCap: optBool(raw.acceptsOutOfNetworkWithOopCap),

  notes: optString(raw.notes),
  overview: optString(raw.overview),
});

const mapPaymentOption = (raw: PaymentOptionConnectOrCreateJSON) => ({
  id: optString(raw.id),
  slug: optString(raw.slug),
  displayName: optString(raw.displayName),
  description: optString(raw.description),
});

const mapRehabPaymentOption = (
  raw: RehabPaymentOptionConnectOrCreateJSON,
): CreateRehabOrgInput['paymentOptions'][number] => ({
  paymentOption: mapPaymentOption(raw.paymentOption),
  descriptionOverride: optString(raw.descriptionOverride),
});

const mapYoutubeChannel = (
  raw: YoutubeChannelConnectOrCreateJSON,
): CreateRehabOrgInput['youtubeChannels'][number] => ({
  id: optString(raw.id),
  url: reqString(raw.url, 'youtubeChannels.url'),
});

const mapSocialProfile = (
  raw: SocialMediaProfileConnectOrCreateJSON,
): CreateRehabOrgInput['socialMediaProfiles'][number] => ({
  id: optString(raw.id),
  platform: reqString(raw.platform, 'socialMediaProfiles.platform'),
  url: reqString(raw.url, 'socialMediaProfiles.url'),
});

// ------------------------------------------------------
// Root Mapper
// ------------------------------------------------------

export function mapRehabOrgEnrichmentJsonToCreateRehabOrgInput(
  raw: RehabOrgEnrichmentJSON,
): CreateRehabOrgInput {
  return {
    state: optString(raw.state),
    city: optString(raw.city),
    zip: optString(raw.zip),
    country: optString(raw.country),

    name: reqString(raw.name, 'name'),
    slug: reqString(raw.slug, 'slug'),

    legalName: optString(raw.legalName),
    npi_number: optString(raw.npi_number),
    description: optString(raw.description),
    tagline: optString(raw.tagline),
    websiteUrl: optString(raw.websiteUrl),
    mainPhone: optString(raw.mainPhone),
    mainEmail: optString(raw.mainEmail),
    yearFounded: optInt(raw.yearFounded),
    isNonProfit: optBool(raw.isNonProfit),
    verifiedExists: optBool(raw.verifiedExists),

    primarySourceUrl: optString(raw.primarySourceUrl),
    otherSourceUrls: asArray(raw.otherSourceUrls),
    heroImageUrl: optString(raw.heroImageUrl),
    galleryImageUrls: asArray(raw.galleryImageUrls),

    baseCurrency: optString(raw.baseCurrency),
    fullPrivatePrice: optInt(raw.fullPrivatePrice),
    defaultTimeZone: optString(raw.defaultTimeZone),

    // Relations
    parentCompany: mapParentCompany(raw.parentCompany),

    insurancePayers: asArray(raw.insurancePayers)?.map(mapRehabInsurancePayer),

    paymentOptions: asArray(raw.paymentOptions)?.map(mapRehabPaymentOption),

    campuses: asArray(raw.campuses)?.map(mapRehabCampusConnectOrCreate),

    accreditations: asArray(raw.accreditations)?.map(mapSimpleSlugRecord),
    reviews: asArray(raw.reviews)?.map(mapOrgReview),
    testimonials: asArray(raw.testimonials)?.map(mapOrgTestimonial),
    stories: asArray(raw.stories)?.map(mapOrgStory),

    levelsOfCare: asArray(raw.levelsOfCare)?.map(mapLevelOfCare),
    detoxServices: asArray(raw.detoxServices)?.map(mapSimpleSlugRecord),
    services: asArray(raw.services)?.map(mapSimpleSlugRecord),
    populations: asArray(raw.populations)?.map(mapSimpleSlugRecord),
    languages: asArray(raw.languages)?.map(mapLanguage),
    amenities: asArray(raw.amenities)?.map(mapSimpleSlugRecord),
    environments: asArray(raw.environments)?.map(mapSimpleSlugRecord),
    settingStyles: asArray(raw.settingStyles)?.map(mapSimpleSlugRecord),
    luxuryTiers: asArray(raw.luxuryTiers)?.map((v) => ({
      slug: reqString(v.slug, 'luxuryTiers.slug'),
      displayName: optString(v.displayName),
      rank: optInt(v.rank),
      description: optString(v.description),
    })),

    programFeaturesGlobal: asArray(raw.programFeaturesGlobal)?.map(
      mapSimpleSlugRecord,
    ),

    youtubeChannels: asArray(raw.youtubeChannels)?.map(mapYoutubeChannel),
    socialMediaProfiles: asArray(raw.socialMediaProfiles)?.map(
      mapSocialProfile,
    ),
  };
}
