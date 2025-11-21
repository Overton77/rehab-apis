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

import { CreateRehabOrgInput } from '../rehab-org-create.input';
import {
  CreateRehabCampusInput,
  CreateRehabProgramInput,
} from '../rehab-program-create.input';
function humanizeSlug(s: string) {
  return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function upsertRehabProgramsWithConnectOrCreate(
  prisma: PrismaClient,
  data: UpsertRehabProgramInput,
): Promise<RehabProgramModel> {
  const {
    id,
    campusId,
    campusSlug,
    levelOfCareSlug,
    detoxServices,
    services,
    populations,
    languages,
    amenities,
    features,
    matTypes,
    substances,
    reviews,
    testimonials,
    stories,

    ...programCore
  } = data;

  // ---- see if program already exists ----
  const existingProgram = await prisma.rehabProgram.findUnique({
    where: { id },
    select: {
      id: true,
      campus: {
        select: {
          id: true,
          rehabOrg: { select: { id: true } },
        },
      },
      levelOfCare: {
        select: { id: true, slug: true },
      },
    },
  });

  const isCreate = !existingProgram;

  // ---- resolve campus / rehabOrg for joins ----
  const campusConnect = campusId
    ? { id: campusId }
    : campusSlug
      ? { slug: campusSlug }
      : null;

  let campusRow: { id: string; rehabOrgId: string } | null = null;
  let rehabConnect: { id: string } | null = null;

  if (campusConnect) {
    const row = await prisma.rehabCampus.findUnique({
      where: campusConnect,
      select: { id: true, rehabOrg: { select: { id: true } } },
    });
    if (!row || !row.rehabOrg) {
      throw new Error(
        'Campus or parent RehabOrg not found for provided campusId/campusSlug',
      );
    }
    campusRow = { id: row.id, rehabOrgId: row.rehabOrg.id };
    rehabConnect = { id: row.rehabOrg.id };
  } else if (existingProgram?.campus?.rehabOrg?.id) {
    rehabConnect = { id: existingProgram.campus.rehabOrg.id };
  }

  // For pure create, we must have a campus + levelOfCare + core name/slug.
  if (isCreate) {
    if (!campusConnect) {
      throw new Error('campusId or campusSlug is required to create a program');
    }
    if (!levelOfCareSlug) {
      throw new Error('levelOfCareSlug is required to create a program');
    }
    if (!programCore.name || !programCore.slug) {
      throw new Error('name and slug are required to create a program');
    }
  }

  // ---- nested joins block (same for create/update) ----
  const nested = {
    // -------- LevelOfCare --------
    ...(levelOfCareSlug && {
      levelOfCare: { connect: { slug: levelOfCareSlug } },
    }),

    // -------- program-level joins --------
    programDetoxServices: detoxServices?.length
      ? {
          create: detoxServices.map((ds) => ({
            detoxService: {
              connectOrCreate: {
                where: { slug: ds.slug },
                create: {
                  slug: ds.slug,
                  displayName: ds.displayName ?? humanizeSlug(ds.slug),
                  ...(ds.description && { description: ds.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programServices: services?.length
      ? {
          create: services.map((svc) => ({
            service: {
              connectOrCreate: {
                where: { slug: svc.slug },
                create: {
                  slug: svc.slug,
                  displayName: svc.displayName ?? humanizeSlug(svc.slug),
                  ...(svc.description && { description: svc.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programPopulations: populations?.length
      ? {
          create: populations.map((pop) => ({
            population: {
              connectOrCreate: {
                where: { slug: pop.slug },
                create: {
                  slug: pop.slug,
                  displayName: pop.displayName ?? humanizeSlug(pop.slug),
                  ...(pop.description && { description: pop.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programLanguages: languages?.length
      ? {
          create: languages.map((lang) => ({
            language: {
              connectOrCreate: {
                where: { code: lang.code },
                create: {
                  code: lang.code,
                  displayName: lang.displayName ?? humanizeSlug(lang.code),
                  ...(lang.description && { description: lang.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programAmenities: amenities?.length
      ? {
          create: amenities.map((a) => ({
            amenity: {
              connectOrCreate: {
                where: { slug: a.slug },
                create: {
                  slug: a.slug,
                  displayName: a.displayName ?? humanizeSlug(a.slug),
                  ...(a.description && { description: a.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programFeatures: features?.length
      ? {
          create: features.map((f) => ({
            programFeature: {
              connectOrCreate: {
                where: { slug: f.slug },
                create: {
                  slug: f.slug,
                  displayName: f.displayName ?? humanizeSlug(f.slug),
                  ...(f.description && { description: f.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programMATTypes: matTypes?.length
      ? {
          create: matTypes.map((m) => ({
            matType: {
              connectOrCreate: {
                where: { slug: m.slug },
                create: {
                  slug: m.slug,
                  displayName: m.displayName ?? humanizeSlug(m.slug),
                  ...(m.medicationClass && {
                    medicationClass: m.medicationClass,
                  }),
                  ...(m.description && { description: m.description }),
                },
              },
            },
          })),
        }
      : undefined,

    programSubstances: substances?.length
      ? {
          create: substances.map((s) => ({
            substance: {
              connectOrCreate: {
                where: { slug: s.slug },
                create: {
                  slug: s.slug,
                  displayName: s.displayName ?? humanizeSlug(s.slug),
                  ...(s.category && { category: s.category }),
                  ...(s.description && { description: s.description }),
                },
              },
            },
          })),
        }
      : undefined,

    // -------- reputation --------
    programReviews: reviews?.length
      ? {
          create: reviews.map((r) => ({
            rating: r.rating,
            body: r.body,
            ...(r.title && { title: r.title }),
            ...(r.source && { source: r.source }),
            ...(r.reviewerType && { reviewerType: r.reviewerType }),
            ...(r.reviewerName && { reviewerName: r.reviewerName }),
            ...(r.reviewerRole && { reviewerRole: r.reviewerRole }),
            ...(r.externalUrl && { externalUrl: r.externalUrl }),
            ...(r.isFeatured !== undefined && { isFeatured: r.isFeatured }),
            ...(r.isVerified !== undefined && { isVerified: r.isVerified }),
          })),
        }
      : undefined,

    programTestimonials: testimonials?.length
      ? {
          create: testimonials.map((t) => ({
            quote: t.quote,
            ...(t.attributionName && { attributionName: t.attributionName }),
            ...(t.attributionRole && { attributionRole: t.attributionRole }),
            ...(t.source && { source: t.source }),
            ...(t.isFeatured !== undefined && { isFeatured: t.isFeatured }),
          })),
        }
      : undefined,

    programStories: stories?.length
      ? {
          create: stories.map((s) => ({
            title: s.title,
            slug: s.slug,
            body: s.body,
            ...(s.summary && { summary: s.summary }),
            ...(s.storyType && { storyType: s.storyType }),
            ...(s.tags?.length && { tags: s.tags }),
            ...(s.isPublic !== undefined && { isPublic: s.isPublic }),
            ...(s.isFeatured !== undefined && { isFeatured: s.isFeatured }),
          })),
        }
      : undefined,

    // -------- insurance (join requires rehab & campus) --------

    // -------- payment options (join requires rehab & campus) --------
  };

  // ---- create vs update payloads ----
  const createData = {
    ...programCore,
    campus: {
      connect: campusRow ? { id: campusRow.id } : campusConnect,
    },
    levelOfCare: {
      connect: { slug: levelOfCareSlug! }, // validated for create
    },
    ...nested,
  };

  const updateData = {
    ...programCore,
    ...(campusRow &&
      campusConnect && {
        campus: { connect: { id: campusRow.id } },
      }),
    ...(levelOfCareSlug && {
      levelOfCare: { connect: { slug: levelOfCareSlug } },
    }),
    ...nested,
  };

  const rehabCampus = await prisma.rehabProgram.upsert({
    where: { id },
    create: createData as Prisma.RehabProgramCreateInput,
    update: updateData as Prisma.RehabProgramUpdateInput,
    include: {
      campus: { include: { rehabOrg: true } },
      levelOfCare: true,
      programDetoxServices: { include: { detoxService: true } },
      programServices: { include: { service: true } },
      programPopulations: { include: { population: true } },
      programLanguages: { include: { language: true } },
      programAmenities: { include: { amenity: true } },
      programFeatures: { include: { programFeature: true } },
      programMATTypes: { include: { matType: true } },
      programSubstances: { include: { substance: true } },
      programReviews: true,
      programTestimonials: true,
      programStories: true,
    },
  });

  return rehabCampus;
}
