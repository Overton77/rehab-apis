import { Cache } from 'cache-manager';

import { RehabCampus as RehabCampusModel } from 'prisma/generated/client';
import type { GetCacheKeyFn } from './cacheTypeFn';

import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';

import { RehabCampusFilterInput } from '../rehab-filters.input';

import { buildIntRangeFilter } from './findFiltersUtils';

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
  // Destructure out pagination – you'll handle this in the service layer
  const { skip, take, ...filtersWithoutPagination } = filters ?? {};

  const where: Prisma.RehabCampusWhereInput = {};
  const f = filtersWithoutPagination; // alias for brevity

  // -------- identity / basic search --------
  if (f?.ids?.length) {
    where.id = { in: f.ids };
  }

  if (f?.slugs?.length) {
    where.slug = { in: f.slugs };
  }

  if (f?.rehabOrgIds?.length) {
    where.rehabOrgId = { in: f.rehabOrgIds };
  }

  if (f?.search) {
    where.OR = [
      { name: { contains: f.search, mode: 'insensitive' } },
      { displayName: { contains: f.search, mode: 'insensitive' } },
      { description: { contains: f.search, mode: 'insensitive' } },
    ];
  }

  // -------- location fields --------
  if (f?.states?.length) {
    where.state = { in: f.states };
  }

  if (f?.cities?.length) {
    where.city = { in: f.cities };
  }

  if (f?.postalCodes?.length) {
    where.postalCode = { in: f.postalCodes };
  }

  if (f?.countries?.length) {
    where.country = { in: f.countries };
  }

  // -------- operational / clinical-ish flags --------
  if (f?.bedsTotal) {
    where.bedsTotal = buildIntRangeFilter(f.bedsTotal);
  }

  if (f?.bedsDetox) {
    where.bedsDetox = buildIntRangeFilter(f.bedsDetox);
  }

  if (f?.bedsResidential) {
    where.bedsResidential = buildIntRangeFilter(f.bedsResidential);
  }

  if (f?.bedsOutpatientCapacity) {
    where.bedsOutpatientCapacity = buildIntRangeFilter(
      f.bedsOutpatientCapacity,
    );
  }

  if (f?.acceptsWalkIns?.equals !== undefined) {
    where.acceptsWalkIns = f.acceptsWalkIns.equals;
  }

  if (f?.hasOnsiteMD?.equals !== undefined) {
    where.hasOnsiteMD = f.hasOnsiteMD.equals;
  }

  if (f?.hasTwentyFourHourNursing?.equals !== undefined) {
    where.hasTwentyFourHourNursing = f.hasTwentyFourHourNursing.equals;
  }

  // -------- primary aesthetic descriptors --------
  if (f?.primaryEnvironmentIds?.length) {
    where.primaryEnvironmentId = { in: f.primaryEnvironmentIds };
  }

  if (f?.primarySettingStyleIds?.length) {
    where.primarySettingStyleId = { in: f.primarySettingStyleIds };
  }

  if (f?.primaryLuxuryTierIds?.length) {
    where.primaryLuxuryTierId = { in: f.primaryLuxuryTierIds };
  }

  // -------- campus-level join-table filters --------
  if (f?.campusAmenityIds?.length) {
    where.campusAmenities = {
      some: { amenityId: { in: f.campusAmenityIds } },
    };
  }

  if (f?.campusLanguageIds?.length) {
    where.campusLanguages = {
      some: { languageId: { in: f.campusLanguageIds } },
    };
  }

  if (f?.campusPopulationIds?.length) {
    where.campusPopulations = {
      some: { populationId: { in: f.campusPopulationIds } },
    };
  }

  if (f?.campusEnvironmentIds?.length) {
    where.campusEnvironments = {
      some: { environmentId: { in: f.campusEnvironmentIds } },
    };
  }

  if (f?.campusSettingStyleIds?.length) {
    where.campusSettingStyles = {
      some: { settingStyleId: { in: f.campusSettingStyleIds } },
    };
  }

  if (f?.campusLuxuryTierIds?.length) {
    where.campusLuxuryTiers = {
      some: { luxuryTierId: { in: f.campusLuxuryTierIds } },
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

  // -------- program-derived filters (AND on the same relation) --------
  const programAndFilters: Prisma.RehabProgramWhereInput[] = [];

  if (f?.programLevelOfCareIds?.length) {
    programAndFilters.push({
      levelOfCareId: { in: f.programLevelOfCareIds },
    });
  }

  if (f?.programDetoxServiceIds?.length) {
    programAndFilters.push({
      programDetoxServices: {
        some: { detoxServiceId: { in: f.programDetoxServiceIds } },
      },
    });
  }

  if (f?.programServiceIds?.length) {
    programAndFilters.push({
      programServices: {
        some: { serviceId: { in: f.programServiceIds } },
      },
    });
  }

  if (f?.programPopulationIds?.length) {
    programAndFilters.push({
      programPopulations: {
        some: { populationId: { in: f.programPopulationIds } },
      },
    });
  }

  if (f?.programLanguageIds?.length) {
    programAndFilters.push({
      programLanguages: {
        some: { languageId: { in: f.programLanguageIds } },
      },
    });
  }

  if (f?.programAmenityIds?.length) {
    programAndFilters.push({
      programAmenities: {
        some: { amenityId: { in: f.programAmenityIds } },
      },
    });
  }

  if (f?.programFeatureIds?.length) {
    programAndFilters.push({
      programFeatures: {
        some: { programFeatureId: { in: f.programFeatureIds } },
      },
    });
  }

  if (f?.programMATTypeIds?.length) {
    programAndFilters.push({
      programMATTypes: {
        some: { matTypeId: { in: f.programMATTypeIds } },
      },
    });
  }

  if (f?.programSubstanceIds?.length) {
    programAndFilters.push({
      programSubstances: {
        some: { substanceId: { in: f.programSubstanceIds } },
      },
    });
  }

  if (programAndFilters.length) {
    where.programs = {
      some: {
        AND: programAndFilters,
      },
    };
  }

  // -------- caching wrapper (key ignores skip/take) --------
  let cacheKey: string | undefined;

  if (cacheManager && getCacheKey) {
    cacheKey = getCacheKey('rehabCampuses:findMany', filtersWithoutPagination);

    const cached = await cacheManager.get<RehabCampusModel[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Always fetch full result set; pagination is done in the service layer
  const rehabCampuses = await prisma.rehabCampus.findMany({
    where,
    include: INCLUDE_RELATIONS_REHAB_CAMPUS,
  });

  if (cacheManager && cacheKey) {
    await cacheManager.set(cacheKey, rehabCampuses, ttlSeconds);
  }

  return rehabCampuses;
}
