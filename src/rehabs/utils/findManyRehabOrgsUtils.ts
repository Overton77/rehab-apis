import { Cache } from 'cache-manager';

import { RehabOrg as RehabOrgModel } from 'prisma/generated/client';
import { RehabOrgFilterInput } from '../rehab-filters.input';
import type { GetCacheKeyFn } from './cacheTypeFn';

import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';

import { buildIntRangeFilter, buildStringFilter } from './findFiltersUtils';

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
  // Strip pagination out; you'll handle skip/take in the service layer
  const { skip, take, ...filtersWithoutPagination } = filters ?? {};
  const f = filtersWithoutPagination;

  const where: Prisma.RehabOrgWhereInput = {};

  // -------- identity / basic search --------
  if (f?.ids?.length) {
    where.id = { in: f.ids };
  }

  if (f?.slugs?.length) {
    where.slug = { in: f.slugs };
  }

  if (f?.search) {
    where.OR = [
      { name: { contains: f.search, mode: 'insensitive' } },
      { legalName: { contains: f.search, mode: 'insensitive' } },
      { description: { contains: f.search, mode: 'insensitive' } },
      { tagline: { contains: f.search, mode: 'insensitive' } },
    ];
  }

  // -------- core fields --------
  if (f?.name) {
    where.name = buildStringFilter(f.name);
  }

  if (f?.legalName) {
    where.legalName = buildStringFilter(f.legalName);
  }

  if (f?.npiNumber) {
    where.npi_number = buildStringFilter(f.npiNumber);
  }

  if (f?.states?.length) {
    where.state = { in: f.states };
  }

  if (f?.cities?.length) {
    where.city = { in: f.cities };
  }

  if (f?.zips?.length) {
    where.zip = { in: f.zips };
  }

  if (f?.countries?.length) {
    where.country = { in: f.countries };
  }

  if (f?.isNonProfit?.equals !== undefined) {
    where.isNonProfit = f.isNonProfit.equals;
  }

  if (f?.verifiedExists?.equals !== undefined) {
    where.verifiedExists = f.verifiedExists.equals;
  }

  if (f?.yearFounded) {
    where.yearFounded = buildIntRangeFilter(f.yearFounded);
  }

  if (f?.fullPrivatePrice) {
    where.fullPrivatePrice = buildIntRangeFilter(f.fullPrivatePrice);
  }

  // -------- join-table filters --------
  if (f?.accreditationIds?.length) {
    where.orgAccreditations = {
      some: { accreditationId: { in: f.accreditationIds } },
    };
  }

  if (f?.levelOfCareIds?.length) {
    where.levelsOfCare = {
      some: { levelOfCareId: { in: f.levelOfCareIds } },
    };
  }

  if (f?.detoxServiceIds?.length) {
    where.detoxServices = {
      some: { detoxServiceId: { in: f.detoxServiceIds } },
    };
  }

  if (f?.serviceIds?.length) {
    where.services = {
      some: { serviceId: { in: f.serviceIds } },
    };
  }

  if (f?.populationIds?.length) {
    where.populations = {
      some: { populationId: { in: f.populationIds } },
    };
  }

  if (f?.languageIds?.length) {
    where.languages = {
      some: { languageId: { in: f.languageIds } },
    };
  }

  if (f?.amenityIds?.length) {
    where.amenities = {
      some: { amenityId: { in: f.amenityIds } },
    };
  }

  if (f?.environmentIds?.length) {
    where.environments = {
      some: { environmentId: { in: f.environmentIds } },
    };
  }

  if (f?.settingStyleIds?.length) {
    where.settingStyles = {
      some: { settingStyleId: { in: f.settingStyleIds } },
    };
  }

  if (f?.luxuryTierIds?.length) {
    where.luxuryTiers = {
      some: { luxuryTierId: { in: f.luxuryTierIds } },
    };
  }

  if (f?.programFeatureGlobalIds?.length) {
    where.programFeaturesGlobal = {
      some: { programFeatureId: { in: f.programFeatureGlobalIds } },
    };
  }

  if (f?.insurancePayerIds?.length) {
    where.insurancePayers = {
      some: { insurancePayerId: { in: f.insurancePayerIds } },
    };
  }

  if (f?.paymentOptionIds?.length) {
    where.paymentOptions = {
      some: { paymentOptionId: { in: f.paymentOptionIds } },
    };
  }

  // -------- relational filters via campuses/programs (AND on same relation) --------
  const campusAndFilters: Prisma.RehabCampusWhereInput[] = [];
  const programAndFiltersForCampus: Prisma.RehabProgramWhereInput[] = [];

  if (f?.campusStates?.length) {
    campusAndFilters.push({
      state: { in: f.campusStates },
    });
  }

  if (f?.programLevelOfCareIds?.length) {
    programAndFiltersForCampus.push({
      levelOfCareId: { in: f.programLevelOfCareIds },
    });
  }

  if (f?.programMATTypeIds?.length) {
    programAndFiltersForCampus.push({
      programMATTypes: {
        some: { matTypeId: { in: f.programMATTypeIds } },
      },
    });
  }

  if (f?.programSubstanceIds?.length) {
    programAndFiltersForCampus.push({
      programSubstances: {
        some: { substanceId: { in: f.programSubstanceIds } },
      },
    });
  }

  if (programAndFiltersForCampus.length) {
    campusAndFilters.push({
      programs: {
        some: {
          AND: programAndFiltersForCampus,
        },
      },
    });
  }

  if (campusAndFilters.length) {
    where.campuses = {
      some: {
        AND: campusAndFilters,
      },
    };
  }

  // -------- caching wrapper (key ignores skip/take) --------
  let cacheKey: string | undefined;
  if (cacheManager && getCacheKey) {
    cacheKey = getCacheKey('rehabOrgs:findMany', filtersWithoutPagination);
    const cached = await cacheManager.get<RehabOrgModel[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Always full result set; pagination handled in service layer
  const rehabs = await prisma.rehabOrg.findMany({
    where,
    include: INCLUDE_RELATIONS_REHAB_ORG,
  });

  if (cacheManager && cacheKey) {
    await cacheManager.set(cacheKey, rehabs, ttlSeconds);
  }

  return rehabs;
}
