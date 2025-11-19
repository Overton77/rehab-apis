import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma.service';
import { UpsertRehabProgramInput } from '../rehab-program.upsert.inputs';
import { UpsertRehabCampusInput } from '../rehab-campus.upsert.inputs';
import { UpsertRehabOrgInput } from '../rehab-org.upsert.inputs';
import {
  NetworkStatus,
  InsuranceScope,
  LevelOfCareType,
  RehabOrg as RehabOrgModel,
  RehabCampus as RehabCampusModel,
  RehabProgram as RehabProgramModel,
  ParentCompany as ParentCompanyModel,
  InsurancePayer as InsurancePayerModel,
  LevelOfCare as LevelOfCareModel,
  DetoxService as DetoxServiceModel,
  MATType as MATTypeModel,
  Service as ServiceModel,
  Population as PopulationModel,
  Accreditation as AccreditationModel,
  Language as LanguageModel,
  Amenity as AmenityModel,
  Environment as EnvironmentModel,
  SettingStyle as SettingStyleModel,
  LuxuryTier as LuxuryTierModel,
  ProgramFeature as ProgramFeatureModel,
  PaymentOption as PaymentOptionModel,
  Substance as SubstanceModel,
} from 'prisma/generated/client';
import type { GetCacheKeyFn } from './cacheTypeFn';

import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';

import {
  RehabProgramFilterInput,
  RehabCampusFilterInput,
  RehabOrgFilterInput,
  StringFilter,
  IntRangeFilter,
  FloatRangeFilter,
} from '../rehab-filters.input';

import { CreateRehabOrgInput } from '../rehab-org-create.input';
import {
  CreateRehabCampusInput,
  CreateRehabProgramInput,
} from '../rehab-program-create.input';

import {
  buildIntRangeFilter,
  buildFloatRangeFilter,
  buildStringFilter,
} from './findFiltersUtils';
function humanizeSlug(s: string) {
  return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const INCLUDE_RELATIONS_REHAB_CAMPUS = {
  primaryEnvironment: true,
  primarySettingStyle: true,
  primaryLuxuryTier: true,
  programs: true,
  campusAmenities: true,
  campusLanguages: true,
  campusPopulations: true,
  campusEnvironments: true,
  campusSettingStyles: true,
  campusReviews: true,
  campusTestimonials: true,
  campusLuxuryTiers: true,
  campusStories: true,
  insurancePayers: true,
  paymentOptions: true,
  socialMediaProfiles: true,
};

export async function findManyRehabCampusesWithFilter(
  prisma: PrismaClient,
  filters: RehabCampusFilterInput | undefined,
  cacheManager?: Cache,
  getCacheKey?: GetCacheKeyFn,
  ttlSeconds = 60,
): Promise<RehabCampusModel[]> {
  const where: Prisma.RehabCampusWhereInput = {};

  // -------- identity / basic search --------
  if (filters?.ids?.length) {
    where.id = { in: filters.ids };
  }

  if (filters?.slugs?.length) {
    where.slug = { in: filters.slugs };
  }

  if (filters?.rehabOrgIds?.length) {
    where.rehabOrgId = { in: filters.rehabOrgIds };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { displayName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // -------- location fields --------
  if (filters?.states?.length) {
    where.state = { in: filters.states };
  }

  if (filters?.cities?.length) {
    where.city = { in: filters.cities };
  }

  if (filters?.postalCodes?.length) {
    where.postalCode = { in: filters.postalCodes };
  }

  if (filters?.countries?.length) {
    where.country = { in: filters.countries };
  }

  // -------- operational / clinical-ish flags --------
  if (filters?.bedsTotal) {
    where.bedsTotal = buildIntRangeFilter(filters.bedsTotal);
  }

  if (filters?.bedsDetox) {
    where.bedsDetox = buildIntRangeFilter(filters.bedsDetox);
  }

  if (filters?.bedsResidential) {
    where.bedsResidential = buildIntRangeFilter(filters.bedsResidential);
  }

  if (filters?.bedsOutpatientCapacity) {
    where.bedsOutpatientCapacity = buildIntRangeFilter(
      filters.bedsOutpatientCapacity,
    );
  }

  if (filters?.acceptsWalkIns?.equals !== undefined) {
    where.acceptsWalkIns = filters.acceptsWalkIns.equals;
  }

  if (filters?.hasOnsiteMD?.equals !== undefined) {
    where.hasOnsiteMD = filters.hasOnsiteMD.equals;
  }

  if (filters?.hasTwentyFourHourNursing?.equals !== undefined) {
    where.hasTwentyFourHourNursing = filters.hasTwentyFourHourNursing.equals;
  }

  // -------- primary aesthetic descriptors --------
  if (filters?.primaryEnvironmentIds?.length) {
    where.primaryEnvironmentId = { in: filters.primaryEnvironmentIds };
  }

  if (filters?.primarySettingStyleIds?.length) {
    where.primarySettingStyleId = { in: filters.primarySettingStyleIds };
  }

  if (filters?.primaryLuxuryTierIds?.length) {
    where.primaryLuxuryTierId = { in: filters.primaryLuxuryTierIds };
  }

  // -------- campus-level join-table filters --------
  if (filters?.campusAmenityIds?.length) {
    where.campusAmenities = {
      some: { amenityId: { in: filters.campusAmenityIds } },
    };
  }

  if (filters?.campusLanguageIds?.length) {
    where.campusLanguages = {
      some: { languageId: { in: filters.campusLanguageIds } },
    };
  }

  if (filters?.campusPopulationIds?.length) {
    where.campusPopulations = {
      some: { populationId: { in: filters.campusPopulationIds } },
    };
  }

  if (filters?.campusEnvironmentIds?.length) {
    where.campusEnvironments = {
      some: { environmentId: { in: filters.campusEnvironmentIds } },
    };
  }

  if (filters?.campusSettingStyleIds?.length) {
    where.campusSettingStyles = {
      some: { settingStyleId: { in: filters.campusSettingStyleIds } },
    };
  }

  if (filters?.campusLuxuryTierIds?.length) {
    where.campusLuxuryTiers = {
      some: { luxuryTierId: { in: filters.campusLuxuryTierIds } },
    };
  }

  if (filters?.insurancePayerIds?.length) {
    where.insurancePayers = {
      some: { insurancePayerId: { in: filters.insurancePayerIds } },
    };
  }

  if (filters?.paymentOptionIds?.length) {
    where.paymentOptions = {
      some: { paymentOptionId: { in: filters.paymentOptionIds } },
    };
  }

  // -------- program-derived filters --------
  if (filters?.programLevelOfCareIds?.length) {
    where.programs = {
      some: { levelOfCareId: { in: filters.programLevelOfCareIds } },
    };
  }

  if (filters?.programDetoxServiceIds?.length) {
    where.programs = {
      some: {
        programDetoxServices: {
          some: { detoxServiceId: { in: filters.programDetoxServiceIds } },
        },
      },
    };
  }

  if (filters?.programServiceIds?.length) {
    where.programs = {
      some: {
        programServices: {
          some: { serviceId: { in: filters.programServiceIds } },
        },
      },
    };
  }

  if (filters?.programPopulationIds?.length) {
    where.programs = {
      some: {
        programPopulations: {
          some: { populationId: { in: filters.programPopulationIds } },
        },
      },
    };
  }

  if (filters?.programLanguageIds?.length) {
    where.programs = {
      some: {
        programLanguages: {
          some: { languageId: { in: filters.programLanguageIds } },
        },
      },
    };
  }

  if (filters?.programAmenityIds?.length) {
    where.programs = {
      some: {
        programAmenities: {
          some: { amenityId: { in: filters.programAmenityIds } },
        },
      },
    };
  }

  if (filters?.programFeatureIds?.length) {
    where.programs = {
      some: {
        programFeatures: {
          some: { programFeatureId: { in: filters.programFeatureIds } },
        },
      },
    };
  }

  if (filters?.programMATTypeIds?.length) {
    where.programs = {
      some: {
        programMATTypes: {
          some: { matTypeId: { in: filters.programMATTypeIds } },
        },
      },
    };
  }

  if (filters?.programSubstanceIds?.length) {
    where.programs = {
      some: {
        programSubstances: {
          some: { substanceId: { in: filters.programSubstanceIds } },
        },
      },
    };
  }

  // -------- caching wrapper --------
  let cacheKey: string | undefined;
  if (cacheManager && getCacheKey) {
    cacheKey = getCacheKey('rehabCampuses:findMany', filters ?? {});
    const cached = await cacheManager.get<RehabCampusModel[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const rehabCampus = await prisma.rehabCampus.findMany({
    where,
    include: INCLUDE_RELATIONS_REHAB_CAMPUS,
  });

  if (cacheManager && cacheKey) {
    await cacheManager.set(cacheKey, rehabCampus, ttlSeconds);
  }

  return rehabCampus;
}
