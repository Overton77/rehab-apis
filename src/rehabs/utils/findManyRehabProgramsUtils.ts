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

import {
  buildIntRangeFilter,
  buildFloatRangeFilter,
  buildStringFilter,
} from './findFiltersUtils';

import type { GetCacheKeyFn } from './cacheTypeFn';

import { CreateRehabOrgInput } from '../rehab-org-create.input';
import {
  CreateRehabCampusInput,
  CreateRehabProgramInput,
} from '../rehab-program-create.input';

import { humanizeSlug } from './general';

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
  const where: Prisma.RehabProgramWhereInput = {};

  // -------- identity / basic search --------
  if (filters?.ids?.length) {
    where.id = { in: filters.ids };
  }

  if (filters?.slugs?.length) {
    where.slug = { in: filters.slugs };
  }

  if (filters?.campusIds?.length) {
    where.campusId = { in: filters.campusIds };
  }

  if (filters?.rehabOrgIds?.length) {
    where.campus = {
      rehabOrgId: { in: filters.rehabOrgIds },
    };
  }

  if (filters?.levelOfCareIds?.length) {
    where.levelOfCareId = { in: filters.levelOfCareIds };
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { shortName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      {
        targetPopulationSummary: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
      {
        clinicalFocusSummary: {
          contains: filters.search,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filters?.name) {
    where.name = buildStringFilter(filters.name);
  }

  // -------- structure & schedule --------
  if (filters?.minLengthOfStayDays) {
    where.minLengthOfStayDays = buildIntRangeFilter(
      filters.minLengthOfStayDays,
    );
  }

  if (filters?.maxLengthOfStayDays) {
    where.maxLengthOfStayDays = buildIntRangeFilter(
      filters.maxLengthOfStayDays,
    );
  }

  if (filters?.typicalLengthOfStayDays) {
    where.typicalLengthOfStayDays = buildIntRangeFilter(
      filters.typicalLengthOfStayDays,
    );
  }

  if (filters?.sessionScheduleContains) {
    where.sessionScheduleSummary = {
      contains: filters.sessionScheduleContains,
      mode: 'insensitive',
    };
  }

  // -------- clinical flags --------
  if (filters?.isDetoxPrimary?.equals !== undefined) {
    where.isDetoxPrimary = filters.isDetoxPrimary.equals;
  }

  if (filters?.isMATProgram?.equals !== undefined) {
    where.isMATProgram = filters.isMATProgram.equals;
  }

  if (filters?.hasOnsiteMD?.equals !== undefined) {
    where.hasOnsiteMD = filters.hasOnsiteMD.equals;
  }

  if (filters?.hasTwentyFourHourNursing?.equals !== undefined) {
    where.hasTwentyFourHourNursing = filters.hasTwentyFourHourNursing.equals;
  }

  if (filters?.staffToPatientRatio) {
    where.staffToPatientRatio = buildFloatRangeFilter(
      filters.staffToPatientRatio,
    );
  }

  if (filters?.acceptsSelfReferral?.equals !== undefined) {
    where.acceptsSelfReferral = filters.acceptsSelfReferral.equals;
  }

  if (filters?.acceptsCourtOrdered?.equals !== undefined) {
    where.acceptsCourtOrdered = filters.acceptsCourtOrdered.equals;
  }

  if (filters?.acceptsMedicallyComplex?.equals !== undefined) {
    where.acceptsMedicallyComplex = filters.acceptsMedicallyComplex.equals;
  }

  if (filters?.waitlistCategories?.length) {
    where.waitlistCategory = { in: filters.waitlistCategories };
  }

  // -------- join-table filters --------
  if (filters?.detoxServiceIds?.length) {
    where.programDetoxServices = {
      some: { detoxServiceId: { in: filters.detoxServiceIds } },
    };
  }

  if (filters?.serviceIds?.length) {
    where.programServices = {
      some: { serviceId: { in: filters.serviceIds } },
    };
  }

  if (filters?.populationIds?.length) {
    where.programPopulations = {
      some: { populationId: { in: filters.populationIds } },
    };
  }

  if (filters?.languageIds?.length) {
    where.programLanguages = {
      some: { languageId: { in: filters.languageIds } },
    };
  }

  if (filters?.amenityIds?.length) {
    where.programAmenities = {
      some: { amenityId: { in: filters.amenityIds } },
    };
  }

  if (filters?.featureIds?.length) {
    where.programFeatures = {
      some: { programFeatureId: { in: filters.featureIds } },
    };
  }

  if (filters?.matTypeIds?.length) {
    where.programMATTypes = {
      some: { matTypeId: { in: filters.matTypeIds } },
    };
  }

  if (filters?.substanceIds?.length) {
    where.programSubstances = {
      some: { substanceId: { in: filters.substanceIds } },
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

  // -------- caching wrapper --------
  let cacheKey: string | undefined;
  if (cacheManager && getCacheKey) {
    cacheKey = getCacheKey('rehabPrograms:findMany', filters ?? {});
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
