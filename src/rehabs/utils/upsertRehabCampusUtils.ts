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

import { humanizeSlug } from './general';

export async function upsertRehabCampusesWithConnectOrCreate(
  prisma: PrismaClient,
  data: UpsertRehabCampusInput,
): Promise<RehabCampusModel> {
  const {
    id,
    rehabOrgId,
    rehabOrgSlug,
    primaryEnvironmentSlug,
    primarySettingStyleSlug,
    primaryLuxuryTierSlug,
    amenities,
    languages,
    populations,
    environments,
    settingStyles,
    luxuryTiers,
    reviews,
    testimonials,
    stories,
    socialMediaProfiles,

    ...campusCore
  } = data;

  // ---- does the campus already exist? ----
  const existingCampus = await prisma.rehabCampus.findUnique({
    where: { id },
    select: { id: true, rehabOrg: { select: { id: true } } },
  });

  // ---- resolve parent org / rehabConnect for joins ----
  const orgConnect = rehabOrgId
    ? { id: rehabOrgId }
    : rehabOrgSlug
      ? { slug: rehabOrgSlug }
      : null;

  let rehabConnect: { id: string } | null = null;

  if (orgConnect) {
    const orgRow = await prisma.rehabOrg.findUnique({
      where: orgConnect,
      select: { id: true },
    });
    if (!orgRow) {
      throw new Error(
        'RehabOrg not found for provided rehabOrgId/rehabOrgSlug',
      );
    }
    rehabConnect = { id: orgRow.id };
  } else if (existingCampus?.rehabOrg?.id) {
    rehabConnect = { id: existingCampus.rehabOrg.id };
  }

  // For a pure CREATE (no existing campus), we **must** have a parent org.
  const isCreate = !existingCampus;
  if (isCreate && !orgConnect) {
    throw new Error(
      'rehabOrgId or rehabOrgSlug is required to create a campus',
    );
  }

  // For CREATE, also require name + slug (you can add more if you want: street/city/etc.)
  if (isCreate) {
    if (!campusCore.name || !campusCore.slug) {
      throw new Error('name and slug are required to create a campus');
    }
  }

  // If user is trying to attach insurance/payment without a rehab, block.

  // ---- build nested block reused for create/update ----
  const nested = {
    // -------- Primary aesthetic descriptors --------
    ...(primaryEnvironmentSlug && {
      primaryEnvironment: { connect: { slug: primaryEnvironmentSlug } },
    }),
    ...(primarySettingStyleSlug && {
      primarySettingStyle: { connect: { slug: primarySettingStyleSlug } },
    }),
    ...(primaryLuxuryTierSlug && {
      primaryLuxuryTier: { connect: { slug: primaryLuxuryTierSlug } },
    }),

    // -------- campus-level joins --------
    campusAmenities: amenities?.length
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

    campusLanguages: languages?.length
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

    campusPopulations: populations?.length
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

    campusEnvironments: environments?.length
      ? {
          create: environments.map((env) => ({
            environment: {
              connectOrCreate: {
                where: { slug: env.slug },
                create: {
                  slug: env.slug,
                  displayName: env.displayName ?? humanizeSlug(env.slug),
                  ...(env.description && { description: env.description }),
                },
              },
            },
          })),
        }
      : undefined,

    campusSettingStyles: settingStyles?.length
      ? {
          create: settingStyles.map((style) => ({
            settingStyle: {
              connectOrCreate: {
                where: { slug: style.slug },
                create: {
                  slug: style.slug,
                  displayName: style.displayName ?? humanizeSlug(style.slug),
                  ...(style.description && {
                    description: style.description,
                  }),
                },
              },
            },
          })),
        }
      : undefined,

    campusLuxuryTiers: luxuryTiers?.length
      ? {
          create: luxuryTiers.map((tier) => ({
            luxuryTier: {
              connectOrCreate: {
                where: { slug: tier.slug },
                create: {
                  slug: tier.slug,
                  displayName: tier.displayName ?? humanizeSlug(tier.slug),
                  rank: typeof tier.rank === 'number' ? tier.rank : null,
                  ...(tier.description && { description: tier.description }),
                },
              },
            },
          })),
        }
      : undefined,

    // -------- reputation --------
    campusReviews: reviews?.length
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

    campusTestimonials: testimonials?.length
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

    campusStories: stories?.length
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

    // -------- social media profiles --------
    socialMediaProfiles: socialMediaProfiles?.length
      ? {
          connectOrCreate: socialMediaProfiles.map((profile) => ({
            where: { url: profile.url },
            create: {
              platform: profile.platform,
              url: profile.url,
            },
          })),
        }
      : undefined,

    // -------- insurance (join requires rehab) --------

    // -------- payment options (join requires rehab) --------
  };

  // ---- core scalar fields (no Prisma type here) ----
  const core = {
    ...(campusCore.name !== undefined && { name: campusCore.name }),
    ...(campusCore.slug !== undefined && { slug: campusCore.slug }),
    ...(campusCore.displayName !== undefined && {
      displayName: campusCore.displayName,
    }),
    ...(campusCore.description !== undefined && {
      description: campusCore.description,
    }),
    ...(campusCore.street !== undefined && { street: campusCore.street }),
    ...(campusCore.city !== undefined && { city: campusCore.city }),
    ...(campusCore.state !== undefined && { state: campusCore.state }),
    ...(campusCore.postalCode !== undefined && {
      postalCode: campusCore.postalCode,
    }),
    ...(campusCore.country !== undefined && { country: campusCore.country }),
    ...(campusCore.latitude !== undefined && {
      latitude: campusCore.latitude,
    }),
    ...(campusCore.longitude !== undefined && {
      longitude: campusCore.longitude,
    }),
    ...(campusCore.phone !== undefined && { phone: campusCore.phone }),
    ...(campusCore.email !== undefined && { email: campusCore.email }),
    ...(campusCore.timeZone !== undefined && {
      timeZone: campusCore.timeZone,
    }),
    ...(campusCore.visitingHours !== undefined && {
      visitingHours: campusCore.visitingHours,
    }),
    ...(campusCore.directionsSummary !== undefined && {
      directionsSummary: campusCore.directionsSummary,
    }),
    ...(campusCore.bedsTotal !== undefined && {
      bedsTotal: campusCore.bedsTotal,
    }),
    ...(campusCore.bedsDetox !== undefined && {
      bedsDetox: campusCore.bedsDetox,
    }),
    ...(campusCore.bedsResidential !== undefined && {
      bedsResidential: campusCore.bedsResidential,
    }),
    ...(campusCore.bedsOutpatientCapacity !== undefined && {
      bedsOutpatientCapacity: campusCore.bedsOutpatientCapacity,
    }),
    ...(campusCore.acceptsWalkIns !== undefined && {
      acceptsWalkIns: campusCore.acceptsWalkIns,
    }),
    ...(campusCore.hasOnsiteMD !== undefined && {
      hasOnsiteMD: campusCore.hasOnsiteMD,
    }),
    ...(campusCore.hasTwentyFourHourNursing !== undefined && {
      hasTwentyFourHourNursing: campusCore.hasTwentyFourHourNursing,
    }),
  };

  // ---- create vs update payloads ----
  const createData = {
    ...core,
    rehabOrg: { connect: orgConnect! }, // create path guaranteed to have orgConnect
    ...nested,
  };

  const updateData = {
    ...core,
    ...(orgConnect && { rehabOrg: { connect: orgConnect } }),
    ...nested,
  };

  const rehabCampus = await prisma.rehabCampus.upsert({
    where: { id },
    create: createData as Prisma.RehabCampusCreateInput,
    update: updateData as Prisma.RehabCampusUpdateInput,
    include: {
      rehabOrg: true,
      primaryEnvironment: true,
      primarySettingStyle: true,
      primaryLuxuryTier: true,
      campusAmenities: { include: { amenity: true } },
      campusLanguages: { include: { language: true } },
      campusPopulations: { include: { population: true } },
      campusEnvironments: { include: { environment: true } },
      campusSettingStyles: { include: { settingStyle: true } },
      campusLuxuryTiers: { include: { luxuryTier: true } },
      campusReviews: true,
      campusTestimonials: true,
      campusStories: true,
      socialMediaProfiles: true,
    },
  });

  return rehabCampus;
}
