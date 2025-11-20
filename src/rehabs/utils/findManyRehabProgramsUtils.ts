import { Cache } from 'cache-manager';

import { RehabProgram as RehabProgramModel } from 'prisma/generated/client';
import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';
import { RehabProgramFilterInput } from '../rehab-filters.input';

import {
  buildIntRangeFilter,
  buildFloatRangeFilter,
  buildStringFilter,
} from './findFiltersUtils';

import type { GetCacheKeyFn } from './cacheTypeFn';

const INCLUDE_RELATIONS_REHAB_PROGRAM = {
  levelOfCare: true,
  programDetoxServices: true,
  programServices: true,
  programPopulations: true,
  programLanguages: true,
  programAmenities: true,
  programFeatures: true,
  programMATTypes: true,
  programSubstances: true,
  programReviews: true,
  programTestimonials: true,
  programStories: true,
  insurancePayers: true,
  paymentOptions: true,
};

export async function findManyRehabProgramsWithFilter(
  prisma: PrismaClient,
  filters: RehabProgramFilterInput | undefined,
  cacheManager?: Cache,
  getCacheKey?: GetCacheKeyFn,
  ttlSeconds = 60,
): Promise<RehabProgramModel[]> {
  // Strip pagination; handled in service layer
  const { skip, take, ...filtersWithoutPagination } = filters ?? {};
  const f = filtersWithoutPagination;

  const where: Prisma.RehabProgramWhereInput = {};

  // -------- identity / basic search --------
  if (f?.ids?.length) {
    where.id = { in: f.ids };
  }

  if (f?.slugs?.length) {
    where.slug = { in: f.slugs };
  }

  if (f?.campusIds?.length) {
    where.campusId = { in: f.campusIds };
  }

  if (f?.rehabOrgIds?.length) {
    where.campus = {
      rehabOrgId: { in: f.rehabOrgIds },
    };
  }

  if (f?.levelOfCareIds?.length) {
    where.levelOfCareId = { in: f.levelOfCareIds };
  }

  if (f?.search) {
    where.OR = [
      { name: { contains: f.search, mode: 'insensitive' } },
      { shortName: { contains: f.search, mode: 'insensitive' } },
      { description: { contains: f.search, mode: 'insensitive' } },
      {
        targetPopulationSummary: {
          contains: f.search,
          mode: 'insensitive',
        },
      },
      {
        clinicalFocusSummary: {
          contains: f.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (f?.name) {
    where.name = buildStringFilter(f.name);
  }

  // -------- structure & schedule --------
  if (f?.minLengthOfStayDays) {
    where.minLengthOfStayDays = buildIntRangeFilter(f.minLengthOfStayDays);
  }

  if (f?.maxLengthOfStayDays) {
    where.maxLengthOfStayDays = buildIntRangeFilter(f.maxLengthOfStayDays);
  }

  if (f?.typicalLengthOfStayDays) {
    where.typicalLengthOfStayDays = buildIntRangeFilter(
      f.typicalLengthOfStayDays,
    );
  }

  if (f?.sessionScheduleContains) {
    where.sessionScheduleSummary = {
      contains: f.sessionScheduleContains,
      mode: 'insensitive',
    };
  }

  // -------- clinical flags --------
  if (f?.isDetoxPrimary?.equals !== undefined) {
    where.isDetoxPrimary = f.isDetoxPrimary.equals;
  }

  if (f?.isMATProgram?.equals !== undefined) {
    where.isMATProgram = f.isMATProgram.equals;
  }

  if (f?.hasOnsiteMD?.equals !== undefined) {
    where.hasOnsiteMD = f.hasOnsiteMD.equals;
  }

  if (f?.hasTwentyFourHourNursing?.equals !== undefined) {
    where.hasTwentyFourHourNursing = f.hasTwentyFourHourNursing.equals;
  }

  if (f?.staffToPatientRatio) {
    where.staffToPatientRatio = buildFloatRangeFilter(f.staffToPatientRatio);
  }

  if (f?.acceptsSelfReferral?.equals !== undefined) {
    where.acceptsSelfReferral = f.acceptsSelfReferral.equals;
  }

  if (f?.acceptsCourtOrdered?.equals !== undefined) {
    where.acceptsCourtOrdered = f.acceptsCourtOrdered.equals;
  }

  if (f?.acceptsMedicallyComplex?.equals !== undefined) {
    where.acceptsMedicallyComplex = f.acceptsMedicallyComplex.equals;
  }

  if (f?.waitlistCategories?.length) {
    where.waitlistCategory = { in: f.waitlistCategories };
  }

  // -------- join-table filters --------
  if (f?.detoxServiceIds?.length) {
    where.programDetoxServices = {
      some: { detoxServiceId: { in: f.detoxServiceIds } },
    };
  }

  if (f?.serviceIds?.length) {
    where.programServices = {
      some: { serviceId: { in: f.serviceIds } },
    };
  }

  if (f?.populationIds?.length) {
    where.programPopulations = {
      some: { populationId: { in: f.populationIds } },
    };
  }

  if (f?.languageIds?.length) {
    where.programLanguages = {
      some: { languageId: { in: f.languageIds } },
    };
  }

  if (f?.amenityIds?.length) {
    where.programAmenities = {
      some: { amenityId: { in: f.amenityIds } },
    };
  }

  if (f?.featureIds?.length) {
    where.programFeatures = {
      some: { programFeatureId: { in: f.featureIds } },
    };
  }

  if (f?.matTypeIds?.length) {
    where.programMATTypes = {
      some: { matTypeId: { in: f.matTypeIds } },
    };
  }

  if (f?.substanceIds?.length) {
    where.programSubstances = {
      some: { substanceId: { in: f.substanceIds } },
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

  // -------- caching wrapper (key ignores skip/take) --------
  let cacheKey: string | undefined;
  if (cacheManager && getCacheKey) {
    cacheKey = getCacheKey('rehabPrograms:findMany', filtersWithoutPagination);
    const cached = await cacheManager.get<RehabProgramModel[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const rehabPrograms = await prisma.rehabProgram.findMany({
    where,
    include: INCLUDE_RELATIONS_REHAB_PROGRAM,
  });

  if (cacheManager && cacheKey) {
    await cacheManager.set(cacheKey, rehabPrograms, ttlSeconds);
  }

  return rehabPrograms;
}
