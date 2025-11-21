import { RehabProgram as RehabProgramModel } from 'prisma/generated/client';

import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';

import { CreateRehabProgramInput } from '../rehab-program-create.input';

import { humanizeSlug } from './general';

export async function createRehabProgram(
  prisma: PrismaClient,
  data: CreateRehabProgramInput,
): Promise<RehabProgramModel> {
  const {
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

  // ---- connect campus (required) ----
  const campusConnect = campusId
    ? { id: campusId }
    : campusSlug
      ? { slug: campusSlug }
      : null;
  if (!campusConnect) {
    throw new Error('campusId or campusSlug is required for program');
  }

  // ---- we also need rehab for join rows ----
  const campusRow = await prisma.rehabCampus.findUnique({
    where: campusConnect,
    select: { id: true, rehabOrg: { select: { id: true } } },
  });
  if (!campusRow || !campusRow.rehabOrg) {
    throw new Error('Campus or parent rehabOrg not found');
  }

  // const rehabConnect = { id: campusRow.rehabOrg.id };
  // RehabId is connected to incoming campus.

  // ---- explicit Prisma data ----
  const prismaData: Prisma.RehabProgramCreateInput = {
    ...programCore,

    campus: { connect: campusConnect },

    // -------- LevelOfCare (connect by slug) --------
    levelOfCare: {
      connect: { slug: levelOfCareSlug },
    },

    // -------- program-level joins (EXPLICIT relation names) --------

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

    // -------- reputation (simple creates) --------
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

    // -------- insurance (join requires rehab + program; attach campus) --------

    // -------- payment options (join requires rehab + program; attach campus) --------
  };
  const rehabProgram = await prisma.rehabProgram.create({
    data: prismaData,
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

  return rehabProgram;
}
