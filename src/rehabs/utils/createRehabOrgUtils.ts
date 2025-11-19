import {
  NetworkStatus,
  InsuranceScope,
  LevelOfCareType,
  RehabOrg as RehabOrgModel,
} from 'prisma/generated/client';

import type { Prisma } from 'prisma/generated/client';
import { PrismaClient } from 'prisma/generated/internal/class';

import { CreateRehabOrgInput } from '../rehab-org-create.input';

import { humanizeSlug } from './general';

export async function createRehabOrg(
  prisma: PrismaClient,
  data: CreateRehabOrgInput,
): Promise<RehabOrgModel> {
  const {
    parentCompany,
    campuses,
    accreditations,
    reviews,
    testimonials,
    stories,
    levelsOfCare,
    detoxServices,
    services,
    populations,
    languages,
    amenities,
    environments,
    settingStyles,
    luxuryTiers,
    insurancePayers,
    paymentOptions,
    programFeaturesGlobal,
    youtubeChannels,
    socialMediaProfiles,
    ...rehabCore
  } = data;

  const prismaData: Prisma.RehabOrgCreateInput = {
    ...rehabCore,
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
    orgTestimonials: testimonials?.length
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

    orgStories: stories?.length
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

    orgReviews: reviews.length
      ? {
          create: reviews.map((r) => ({
            rating: r.rating,
            body: r.body,
            ...(r.title && { title: r.title }),
            ...(r.source && { source: r.source }),
            ...(r.isVerified && { isVerified: r.isVerified }),
            ...(r.reviewerName && { reviewerName: r.reviewerName }),
            ...(r.reviewerRole && { reviewerRole: r.reviewerRole }),
            ...(r.externalUrl && { externalUrl: r.externalUrl }),
            ...(r.reviewerType && { reviewerType: r.reviewerType }),
          })),
        }
      : undefined,

    // ---------------------------
    // ParentCompany (slug @unique)
    // ---------------------------
    parentCompany: parentCompany
      ? {
          connectOrCreate: {
            where: { slug: parentCompany.slug },
            create: {
              name: parentCompany.name,
              slug: parentCompany.slug,
              ...(parentCompany.websiteUrl && {
                websiteUrl: parentCompany.websiteUrl,
              }),
              ...(parentCompany.description && {
                description: parentCompany.description,
              }),
              ...(parentCompany.verifiedExists !== undefined && {
                verifiedExists: parentCompany.verifiedExists,
              }),
              ...(parentCompany.headquartersCity && {
                headquartersCity: parentCompany.headquartersCity,
              }),
              ...(parentCompany.headquartersState && {
                headquartersState: parentCompany.headquartersState,
              }),
              ...(parentCompany.headquartersCountry && {
                headquartersCountry: parentCompany.headquartersCountry,
              }),
              ...(parentCompany.headquartersPostalCode && {
                headquartersPostalCode: parentCompany.headquartersPostalCode,
              }),
              ...(parentCompany.headquartersStreet && {
                headquartersStreet: parentCompany.headquartersStreet,
              }),
            },
          },
        }
      : undefined,

    // ---------------------------
    // (Optional) nested Campuses
    // ---------------------------
    campuses: campuses?.length
      ? {
          connectOrCreate: campuses.map((c) => {
            const create = c.create;

            // Extremely defensive fallback if create is ever missing
            if (!create) {
              return {
                where: { slug: c.slug },
                create: {
                  name: c.slug ?? '',
                  slug: c.slug ?? '',
                  street: '',
                  city: '',
                  state: '',
                  postalCode: '',
                  country: '',
                },
              };
            }

            const envSlug = create.primaryEnvironmentSlug;
            const styleSlug = create.primarySettingStyleSlug;
            const tierSlug = create.primaryLuxuryTierSlug;

            const envDisplayName = envSlug
              ? envSlug.replace(/_/g, ' ')
              : undefined;
            const styleDisplayName = styleSlug
              ? styleSlug.replace(/_/g, ' ')
              : undefined;
            const tierDisplayName = tierSlug
              ? tierSlug.replace(/_/g, ' ')
              : undefined;

            return {
              where: { slug: c.slug ?? create.slug },
              create: {
                name: create.name,
                slug: create.slug,

                ...(create.displayName && {
                  displayName: create.displayName,
                }),
                ...(create.description && {
                  description: create.description,
                }),

                street: create.street,
                city: create.city,
                state: create.state,
                postalCode: create.postalCode,
                country: create.country,

                ...(create.latitude !== undefined && {
                  latitude: create.latitude,
                }),
                ...(create.longitude !== undefined && {
                  longitude: create.longitude,
                }),
                ...(create.phone && { phone: create.phone }),
                ...(create.email && { email: create.email }),
                ...(create.timeZone && { timeZone: create.timeZone }),
                ...(create.visitingHours && {
                  visitingHours: create.visitingHours,
                }),
                ...(create.directionsSummary && {
                  directionsSummary: create.directionsSummary,
                }),
                ...(create.bedsTotal !== undefined && {
                  bedsTotal: create.bedsTotal,
                }),
                ...(create.bedsDetox !== undefined && {
                  bedsDetox: create.bedsDetox,
                }),
                ...(create.bedsResidential !== undefined && {
                  bedsResidential: create.bedsResidential,
                }),
                ...(create.bedsOutpatientCapacity !== undefined && {
                  bedsOutpatientCapacity: create.bedsOutpatientCapacity,
                }),
                ...(create.acceptsWalkIns !== undefined && {
                  acceptsWalkIns: create.acceptsWalkIns,
                }),
                ...(create.hasOnsiteMD !== undefined && {
                  hasOnsiteMD: create.hasOnsiteMD,
                }),
                ...(create.hasTwentyFourHourNursing !== undefined && {
                  hasTwentyFourHourNursing: create.hasTwentyFourHourNursing,
                }),

                // --- vocab relations with connectOrCreate, using ONLY incoming values ---

                ...(envSlug && {
                  primaryEnvironment: {
                    connectOrCreate: {
                      where: { slug: envSlug },
                      create: {
                        slug: envSlug,
                        // Environment.displayName is required
                        displayName: envDisplayName ?? envSlug,
                      },
                    },
                  },
                }),

                ...(styleSlug && {
                  primarySettingStyle: {
                    connectOrCreate: {
                      where: { slug: styleSlug },
                      create: {
                        slug: styleSlug,
                        // SettingStyle.displayName likely required
                        displayName: styleDisplayName ?? styleSlug,
                      },
                    },
                  },
                }),

                ...(tierSlug && {
                  primaryLuxuryTier: {
                    connectOrCreate: {
                      where: { slug: tierSlug },
                      create: {
                        slug: tierSlug,
                        // LuxuryTier.displayName likely required
                        displayName: tierDisplayName ?? tierSlug,
                        // if rank is required in your schema, you can infer a default here
                      },
                    },
                  },
                }),
              },
            };
          }),
        }
      : undefined,
    // ---------------------------
    // InsurancePayer (slug @unique) — join fields on the join row
    // ---------------------------
    insurancePayers: insurancePayers?.length
      ? {
          create: insurancePayers.map((payer) => ({
            scope: payer.scope ?? InsuranceScope.ORG,
            networkStatus: payer.networkStatus ?? NetworkStatus.UNKNOWN,
            averageAdmissionPrice: payer.averageAdmissionPrice ?? null,
            estimatedPatientOopMin: payer.estimatedPatientOopMin ?? null,
            estimatedPatientOopMax: payer.estimatedPatientOopMax ?? null,
            requiresPreauth: payer.requiresPreauth ?? null,
            acceptsOutOfNetworkWithOopCap:
              payer.acceptsOutOfNetworkWithOopCap ?? null,
            notes: payer.notes ?? null,
            overview: payer.overview ?? null,

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

    // ---------------------------
    // PaymentOption (slug @unique)
    // ---------------------------
    paymentOptions: paymentOptions?.length
      ? {
          create: paymentOptions.map((po) => ({
            descriptionOverride: po.descriptionOverride ?? null,
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

    // ---------------------------
    // LevelOfCare (slug @unique)
    // ---------------------------
    levelsOfCare: levelsOfCare?.length
      ? {
          create: levelsOfCare.map((loc) => ({
            levelOfCare: {
              connectOrCreate: {
                where: { slug: loc.slug },
                create: {
                  slug: loc.slug,
                  displayName: loc.displayName ?? humanizeSlug(loc.slug),
                  ...(loc.description && { description: loc.description }),
                  type: loc.type ?? LevelOfCareType.OTHER,
                },
              },
            },
          })),
        }
      : undefined,

    // ---------------------------
    // Service (slug @unique)
    // ---------------------------
    services: services?.length
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

    // ---------------------------
    // DetoxService (slug @unique)
    // ---------------------------
    detoxServices: detoxServices?.length
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

    // ---------------------------
    // Population (slug @unique)
    // ---------------------------
    populations: populations?.length
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

    // ---------------------------
    // Accreditation (slug @unique)
    // ---------------------------
    orgAccreditations: accreditations?.length
      ? {
          create: accreditations.map((ac) => ({
            accreditation: {
              connectOrCreate: {
                where: { slug: ac.slug },
                create: {
                  slug: ac.slug,
                  displayName: ac.displayName ?? humanizeSlug(ac.slug),
                  ...(ac.description && { description: ac.description }),
                },
              },
            },
          })),
        }
      : undefined,

    // ---------------------------
    // Language (code @unique)
    // ---------------------------
    languages: languages?.length
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

    // ---------------------------
    // Amenity (slug @unique)
    // ---------------------------
    amenities: amenities?.length
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

    // ---------------------------
    // Environment (slug @unique)
    // ---------------------------
    environments: environments?.length
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

    // ---------------------------
    // SettingStyle (slug @unique)
    // ---------------------------
    settingStyles: settingStyles?.length
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

    // ---------------------------
    // LuxuryTier (slug @unique)
    // ---------------------------
    luxuryTiers: luxuryTiers?.length
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

    // ---------------------------
    // Org-level ProgramFeatures (slug @unique)
    // ---------------------------
    programFeaturesGlobal: programFeaturesGlobal?.length
      ? {
          create: programFeaturesGlobal.map((feat) => ({
            programFeature: {
              connectOrCreate: {
                where: { slug: feat.slug },
                create: {
                  slug: feat.slug,
                  displayName: feat.displayName ?? humanizeSlug(feat.slug),
                  ...(feat.description && { description: feat.description }),
                },
              },
            },
          })),
        }
      : undefined,

    // Remember to send Youtube id with this !

    youtubeChannels: youtubeChannels?.length
      ? {
          connectOrCreate: youtubeChannels.map((channel) => ({
            where: { url: channel.url },
            // should allow channel.url to be the where clause it's @unique
            create: {
              url: channel.url,
            },
          })),
        }
      : undefined,
  };

  const rehab = await prisma.rehabOrg.create({
    data: prismaData,
  });

  return rehab;
}
