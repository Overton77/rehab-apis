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

const INCLUDE_RELATIONS_REHAB_ORG = {
  parentCompany: true,
  orgAccreditations: true,
  campuses: true,
  orgReviews: true,
  orgTestimonials: true,
  orgStories: true,
  insurancePayers: true,
  paymentOptions: true,
  levelsOfCare: true,
  detoxServices: true,
  services: true,
  populations: true,
  amenities: true,
  environments: true,
  settingStyles: true,
  luxuryTiers: true,
  programFeaturesGlobal: true,
  youtubeChannels: true,
  socialMediaProfiles: true,
};

export async function findManyRehabOrgsWithFilter(
  prisma: PrismaClient,
  filters: RehabOrgFilterInput | undefined,
  cacheManager?: Cache,
  getCacheKey?: GetCacheKeyFn,
  ttlSeconds = 60,
): Promise<RehabOrgModel[]> {
  const where: Prisma.RehabOrgWhereInput = {};

  // -------- identity / basic search --------
  if (filters?.ids?.length) {
    where.id = { in: filters.ids };
  }

  if (filters?.slugs?.length) {
    where.slug = { in: filters.slugs };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { legalName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { tagline: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // -------- core fields --------
  if (filters?.name) {
    where.name = buildStringFilter(filters.name);
  }

  if (filters?.legalName) {
    where.legalName = buildStringFilter(filters.legalName);
  }

  if (filters?.npiNumber) {
    where.npi_number = buildStringFilter(filters.npiNumber);
  }

  if (filters?.states?.length) {
    where.state = { in: filters.states };
  }

  if (filters?.cities?.length) {
    where.city = { in: filters.cities };
  }

  if (filters?.zips?.length) {
    where.zip = { in: filters.zips };
  }

  if (filters?.countries?.length) {
    where.country = { in: filters.countries };
  }

  if (filters?.isNonProfit?.equals !== undefined) {
    where.isNonProfit = filters.isNonProfit.equals;
  }

  if (filters?.verifiedExists?.equals !== undefined) {
    where.verifiedExists = filters.verifiedExists.equals;
  }

  if (filters?.yearFounded) {
    where.yearFounded = buildIntRangeFilter(filters.yearFounded);
  }

  if (filters?.fullPrivatePrice) {
    where.fullPrivatePrice = buildIntRangeFilter(filters.fullPrivatePrice);
  }

  // -------- join-table filters --------
  if (filters?.accreditationIds?.length) {
    where.orgAccreditations = {
      some: { accreditationId: { in: filters.accreditationIds } },
    };
  }

  if (filters?.levelOfCareIds?.length) {
    where.levelsOfCare = {
      some: { levelOfCareId: { in: filters.levelOfCareIds } },
    };
  }

  if (filters?.detoxServiceIds?.length) {
    where.detoxServices = {
      some: { detoxServiceId: { in: filters.detoxServiceIds } },
    };
  }

  if (filters?.serviceIds?.length) {
    where.services = {
      some: { serviceId: { in: filters.serviceIds } },
    };
  }

  if (filters?.populationIds?.length) {
    where.populations = {
      some: { populationId: { in: filters.populationIds } },
    };
  }

  if (filters?.languageIds?.length) {
    where.languages = {
      some: { languageId: { in: filters.languageIds } },
    };
  }

  if (filters?.amenityIds?.length) {
    where.amenities = {
      some: { amenityId: { in: filters.amenityIds } },
    };
  }

  if (filters?.environmentIds?.length) {
    where.environments = {
      some: { environmentId: { in: filters.environmentIds } },
    };
  }

  if (filters?.settingStyleIds?.length) {
    where.settingStyles = {
      some: { settingStyleId: { in: filters.settingStyleIds } },
    };
  }

  if (filters?.luxuryTierIds?.length) {
    where.luxuryTiers = {
      some: { luxuryTierId: { in: filters.luxuryTierIds } },
    };
  }

  if (filters?.programFeatureGlobalIds?.length) {
    where.programFeaturesGlobal = {
      some: { programFeatureId: { in: filters.programFeatureGlobalIds } },
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

  // -------- relational filters via campuses/programs --------
  if (filters?.campusStates?.length) {
    where.campuses = {
      some: { state: { in: filters.campusStates } },
    };
  }

  if (filters?.programLevelOfCareIds?.length) {
    where.campuses = {
      some: {
        programs: {
          some: { levelOfCareId: { in: filters.programLevelOfCareIds } },
        },
      },
    };
  }

  if (filters?.programMATTypeIds?.length) {
    where.campuses = {
      some: {
        programs: {
          some: {
            programMATTypes: {
              some: { matTypeId: { in: filters.programMATTypeIds } },
            },
          },
        },
      },
    };
  }

  if (filters?.programSubstanceIds?.length) {
    where.campuses = {
      some: {
        programs: {
          some: {
            programSubstances: {
              some: { substanceId: { in: filters.programSubstanceIds } },
            },
          },
        },
      },
    };
  }

  // -------- caching wrapper --------
  let cacheKey: string | undefined;
  if (cacheManager && getCacheKey) {
    // key incorporates both operation + filters
    cacheKey = getCacheKey('rehabOrgs:findMany', filters ?? {});
    const cached = await cacheManager.get<RehabOrgModel[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const rehabs = await prisma.rehabOrg.findMany({
    where,
    include: INCLUDE_RELATIONS_REHAB_ORG,
  });

  if (cacheManager && cacheKey) {
    await cacheManager.set(cacheKey, rehabs, ttlSeconds);
  }

  return rehabs;
}
