import {
  InsuranceScope,
  NetworkStatus,
  ReviewSource,
  ReviewerType,
  StoryType,
  LevelOfCareType,
} from '../rehabs/common.enums';

// ---------------------------
// Nested helper interfaces
// ---------------------------

// Parent company (single, optional)
export interface ParentCompanyEnrichmentJSON {
  id?: string;
  slug?: string;
  name?: string;
  websiteUrl?: string;
  description?: string;
  verifiedExists?: boolean;
  headquartersCity?: string;
  headquartersState?: string;
  headquartersCountry?: string;
  headquartersPostalCode?: string;
  headquartersStreet?: string;
}

// ------------ Campuses ------------

export interface RehabCampusCreateForOrgJSON {
  name: string;
  slug: string;
  displayName?: string;
  description?: string;

  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  latitude?: number;
  longitude?: number;

  phone?: string;
  email?: string;

  timeZone?: string;
  visitingHours?: string;
  directionsSummary?: string;

  bedsTotal?: number;
  bedsDetox?: number;
  bedsResidential?: number;
  bedsOutpatientCapacity?: number;

  acceptsWalkIns?: boolean;
  hasOnsiteMD?: boolean;
  hasTwentyFourHourNursing?: boolean;

  primaryEnvironmentSlug?: string;
  primarySettingStyleSlug?: string;
  primaryLuxuryTierSlug?: string;
}

export interface RehabCampusConnectOrCreateJSON {
  id?: string;
  slug?: string;
  create?: RehabCampusCreateForOrgJSON;
}

// ------------ Simple vocab connect-or-create by slug ------------

export interface LevelOfCareConnectOrCreateJSON {
  slug: string; // unique
  displayName?: string;
  description?: string;
  type?: LevelOfCareType;
}

export interface DetoxServiceConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface ServiceConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface PopulationConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface AccreditationConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface LanguageConnectOrCreateJSON {
  code: string; // "en", "es" etc.
  displayName?: string;
  description?: string;
}

export interface AmenityConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface EnvironmentConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface SettingStyleConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

export interface LuxuryTierConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  rank?: number;
  description?: string;
}

export interface ProgramFeatureGlobalConnectOrCreateJSON {
  slug: string;
  displayName?: string;
  description?: string;
}

// ------------ Media connect-or-create ------------

export interface YoutubeChannelConnectOrCreateJSON {
  id?: string;
  url: string;
}

export interface SocialMediaProfileConnectOrCreateJSON {
  id?: string;
  platform: string;
  url: string;
}

// ------------ Org content (create-only) ------------

export interface OrgReviewCreateJSON {
  rating: number;
  title?: string;
  body: string;
  reviewerType?: ReviewerType;
  reviewerName?: string;
  reviewerRole?: string;
  source?: ReviewSource;
  externalUrl?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
}

export interface OrgTestimonialCreateJSON {
  quote: string;
  attributionName?: string;
  attributionRole?: string;
  source?: string;
  isFeatured?: boolean;
}

export interface OrgStoryCreateJSON {
  title: string;
  slug: string;
  storyType?: StoryType;
  summary?: string;
  body: string;
  tags?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
}

// ---------------------------
// Finance: vocab + edges
// ---------------------------

export interface PaymentOptionConnectOrCreateJSON {
  id?: string;
  slug?: string;
  displayName?: string;
  description?: string;
}

export interface InsurancePayerConnectOrCreateJSON {
  id?: string;
  slug?: string;
  companyName?: string;
  displayName?: string;
  description?: string;
  payerType?: string; // "commercial", "medicare", etc.
}

export interface RehabInsurancePayerConnectOrCreateJSON {
  insurancePayer: InsurancePayerConnectOrCreateJSON;
  scope?: InsuranceScope;
  networkStatus?: NetworkStatus;

  averageAdmissionPrice?: number;
  estimatedPatientOopMin?: number;
  estimatedPatientOopMax?: number;

  requiresPreauth?: boolean;
  acceptsOutOfNetworkWithOopCap?: boolean;

  notes?: string;
  overview?: string;
}

export interface RehabPaymentOptionConnectOrCreateJSON {
  paymentOption: PaymentOptionConnectOrCreateJSON;
  descriptionOverride?: string;
}

// ---------------------------
// Root: RehabOrgEnrichmentJSON
// ---------------------------

export interface RehabOrgEnrichmentJSON {
  // ---- Core fields (no id/timestamps) ----

  state?: string;
  city?: string;
  zip?: string;
  country?: string;

  name: string;
  slug: string;

  legalName?: string;
  npi_number?: string;

  description?: string;
  tagline?: string;
  websiteUrl?: string;
  mainPhone?: string;
  mainEmail?: string;

  yearFounded?: number;
  isNonProfit?: boolean;
  verifiedExists?: boolean;

  primarySourceUrl?: string;
  otherSourceUrls?: string[];

  baseCurrency?: string;
  fullPrivatePrice?: number;

  defaultTimeZone?: string;

  // ---- Relations (all second-class) ----

  parentCompany?: ParentCompanyEnrichmentJSON;

  insurancePayers?: RehabInsurancePayerConnectOrCreateJSON[];
  paymentOptions?: RehabPaymentOptionConnectOrCreateJSON[];

  campuses?: RehabCampusConnectOrCreateJSON[];

  accreditations?: AccreditationConnectOrCreateJSON[];

  reviews?: OrgReviewCreateJSON[];
  testimonials?: OrgTestimonialCreateJSON[];
  stories?: OrgStoryCreateJSON[];

  levelsOfCare?: LevelOfCareConnectOrCreateJSON[];
  detoxServices?: DetoxServiceConnectOrCreateJSON[];
  services?: ServiceConnectOrCreateJSON[];
  populations?: PopulationConnectOrCreateJSON[];
  languages?: LanguageConnectOrCreateJSON[];
  amenities?: AmenityConnectOrCreateJSON[];
  environments?: EnvironmentConnectOrCreateJSON[];
  settingStyles?: SettingStyleConnectOrCreateJSON[];
  luxuryTiers?: LuxuryTierConnectOrCreateJSON[];

  programFeaturesGlobal?: ProgramFeatureGlobalConnectOrCreateJSON[];

  youtubeChannels?: YoutubeChannelConnectOrCreateJSON[];
  socialMediaProfiles?: SocialMediaProfileConnectOrCreateJSON[];
}
