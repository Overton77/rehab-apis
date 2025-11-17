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
    overview?: string;
  }>;

  paymentOptions?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  levelsOfCare?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  services?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  detoxServices?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  populations?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  accreditations?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  languages?: Array<{
    code: string;
    displayName: string;
  }>;

  amenities?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  environments?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  settingStyles?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;

  luxuryTiers?: Array<{
    slug?: string;
    displayName: string;
    rank: number;
    description: string;
  }>;

  programFeatures?: Array<{
    slug?: string;
    displayName: string;
    description: string;
  }>;
}
