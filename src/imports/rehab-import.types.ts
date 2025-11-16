// src/rehab-import/rehab-import.types.ts

export interface RehabEnrichmentJson {
  rehab: {
    name: string;
    slug: string;
    npiNumber?: string | null;
    knownAliases?: string[];
    description?: string;
    websiteUrl?: string;
    phone?: string;
    email?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    latitude?: number | null;
    longitude?: number | null;
    verifiedExists: boolean;
    primarySourceUrl?: string;
    otherSourceUrls?: string[];
    fullPrivatePrice?: number | null;
  };

  insurancePayers?: Array<{
    slug?: string;
    displayName: string;
    popular?: boolean | null;
    averageAdmissionPrice?: number | null;
    notes?: string;
  }>;

  paymentOptions?: Array<{
    slug?: string;
    displayName: string;
  }>;

  levelsOfCare?: Array<{
    slug?: string;
    displayName: string;
  }>;

  services?: Array<{
    slug?: string;
    displayName: string;
  }>;

  detoxServices?: Array<{
    slug?: string;
    displayName: string;
  }>;

  populations?: Array<{
    slug?: string;
    displayName: string;
  }>;

  accreditations?: Array<{
    slug?: string;
    displayName: string;
  }>;

  languages?: Array<{
    code: string;
    displayName: string;
  }>;

  amenities?: Array<{
    slug?: string;
    displayName: string;
  }>;

  environments?: Array<{
    slug?: string;
    displayName: string;
  }>;

  settingStyles?: Array<{
    slug?: string;
    displayName: string;
  }>;

  luxuryTiers?: Array<{
    slug?: string;
    displayName: string;
    rank: number;
  }>;

  programFeatures?: Array<{
    slug?: string;
    displayName: string;
  }>;
}
