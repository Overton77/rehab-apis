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
  RehabCampus as RehabCampusModel,
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

export async function createRehabCampus(
  prisma: PrismaClient,
  data: CreateRehabCampusInput,
): Promise<RehabCampusModel> {
  const {
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
    insurancePayers,
    paymentOptions,
    ...campusCore
  } = data;

  // ---- connect parent org (required) ----
  const orgConnect = rehabOrgId
    ? { id: rehabOrgId }
    : rehabOrgSlug
      ? { slug: rehabOrgSlug }
      : null;
  if (!orgConnect) {
    throw new Error('rehabOrgId or rehabOrgSlug is required for campus');
  }

  // ---- we also need the rehab id for join rows ----
  const orgRow = await prisma.rehabOrg.findUnique({
    where: orgConnect,
    select: { id: true },
  });
  if (!orgRow) {
    throw new Error('RehabOrg not found');
  }

  const rehabConnect = { id: orgRow.id };

  // ---- explicit Prisma data ----
  const prismaData: Prisma.RehabCampusCreateInput = {
    ...campusCore,

    rehabOrg: { connect: orgConnect },

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

    // -------- campus-level joins (EXPLICIT relation names) --------

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

    // -------- reputation (simple creates) --------
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

    // -------- insurance (join requires rehab + campus) --------
    insurancePayers: insurancePayers?.length
      ? {
          create: insurancePayers.map((payer) => ({
            scope: payer.scope ?? InsuranceScope.CAMPUS,
            networkStatus: payer.networkStatus ?? NetworkStatus.UNKNOWN,
            averageAdmissionPrice: payer.averageAdmissionPrice ?? null,
            estimatedPatientOopMin: payer.estimatedPatientOopMin ?? null,
            estimatedPatientOopMax: payer.estimatedPatientOopMax ?? null,
            requiresPreauth: payer.requiresPreauth ?? null,
            acceptsOutOfNetworkWithOopCap:
              payer.acceptsOutOfNetworkWithOopCap ?? null,
            notes: payer.notes ?? null,
            overview: payer.overview ?? null,

            rehab: { connect: rehabConnect },

            insurancePayer: {
              connectOrCreate: {
                where: { slug: payer.insurancePayer.slug! },
                create: {
                  slug: payer.insurancePayer.slug!,
                  displayName:
                    payer.insurancePayer.displayName ??
                    humanizeSlug(payer.insurancePayer.slug!),
                  ...(payer.insurancePayer.companyName && {
                    companyName: payer.insurancePayer.companyName,
                  }),
                  ...(payer.insurancePayer.description && {
                    description: payer.insurancePayer.description,
                  }),
                  ...(payer.insurancePayer.payerType && {
                    payerType: payer.insurancePayer.payerType,
                  }),
                },
              },
            },
          })),
        }
      : undefined,

    // -------- payment options (join requires rehab + campus) --------
    paymentOptions: paymentOptions?.length
      ? {
          create: paymentOptions.map((po) => ({
            descriptionOverride: po.descriptionOverride ?? null,
            rehab: { connect: rehabConnect },
            paymentOption: {
              connectOrCreate: {
                where: { slug: po.paymentOption.slug! },
                create: {
                  slug: po.paymentOption.slug!,
                  displayName:
                    po.paymentOption.displayName ??
                    humanizeSlug(po.paymentOption.slug!),
                  ...(po.paymentOption.description && {
                    description: po.paymentOption.description,
                  }),
                },
              },
            },
          })),
        }
      : undefined,
  };

  const rehabCampus = await prisma.rehabCampus.create({
    data: prismaData,
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
      insurancePayers: { include: { insurancePayer: true } },
      paymentOptions: { include: { paymentOption: true } },
    },
  });

  return rehabCampus;
}
