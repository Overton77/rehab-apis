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

export async function upsertRehabOrgsWithConnectOrCreate(
  prisma: PrismaClient,
  input: UpsertRehabOrgInput,
): Promise<RehabOrgModel> {
  const {
    id,
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
  } = input;

  // ---- Does this org already exist? ----
  const existing = await prisma.rehabOrg.findUnique({
    where: { id },
    select: { id: true },
  });

  const isCreate = !existing;

  // ---- Enforce required fields on CREATE only ----
  if (isCreate) {
    if (!rehabCore.name || !rehabCore.slug) {
      throw new Error('name and slug are required to create a RehabOrg');
    }
  }

  // Helper: build nested create/update payload for Prisma
  const buildNested = (): {
    parentCompany?: Prisma.ParentCompanyCreateNestedOneWithoutRehabOrgsInput;
    campuses?: Prisma.RehabCampusCreateNestedManyWithoutRehabOrgInput;
    orgAccreditations?: Prisma.RehabAccreditationCreateNestedManyWithoutRehabInput;
    orgReviews?: Prisma.OrgReviewCreateNestedManyWithoutRehabOrgInput;
    orgTestimonials?: Prisma.OrgTestimonialCreateNestedManyWithoutRehabOrgInput;
    orgStories?: Prisma.OrgStoryCreateNestedManyWithoutRehabOrgInput;
    levelsOfCare?: Prisma.RehabLevelOfCareCreateNestedManyWithoutRehabInput;
    detoxServices?: Prisma.RehabDetoxServiceCreateNestedManyWithoutRehabInput;
    services?: Prisma.RehabServiceCreateNestedManyWithoutRehabInput;
    populations?: Prisma.RehabPopulationCreateNestedManyWithoutRehabInput;
    languages?: Prisma.RehabLanguageCreateNestedManyWithoutRehabInput;
    amenities?: Prisma.RehabAmenityCreateNestedManyWithoutRehabInput;
    environments?: Prisma.RehabEnvironmentCreateNestedManyWithoutRehabInput;
    settingStyles?: Prisma.RehabSettingStyleCreateNestedManyWithoutRehabInput;
    luxuryTiers?: Prisma.RehabLuxuryTierCreateNestedManyWithoutRehabInput;
    programFeaturesGlobal?: Prisma.RehabProgramFeatureGlobalCreateNestedManyWithoutRehabInput;
    insurancePayers?: Prisma.RehabInsurancePayerCreateNestedManyWithoutRehabInput;
    paymentOptions?: Prisma.RehabPaymentOptionCreateNestedManyWithoutRehabInput;
    youtubeChannels?: Prisma.YoutubeChannelCreateNestedManyWithoutRehabOrgInput;
    socialMediaProfiles?: Prisma.SocialMediaProfileCreateNestedManyWithoutRehabOrgInput;
  } => {
    return {
      // -------------------
      // Parent company
      // -------------------
      parentCompany: parentCompany
        ? {
            connectOrCreate: {
              where: parentCompany.id
                ? { id: parentCompany.id }
                : parentCompany.slug
                  ? { slug: parentCompany.slug }
                  : { name: parentCompany.name! }, // fallback
              create: {
                name: parentCompany.name!,
                slug:
                  parentCompany.slug ??
                  parentCompany.name!.toLowerCase().replace(/\s+/g, '-'),
                websiteUrl: parentCompany.websiteUrl,
                description: parentCompany.description,
                verifiedExists: parentCompany.verifiedExists ?? false,
                headquartersCity: parentCompany.headquartersCity,
                headquartersState: parentCompany.headquartersState,
                headquartersCountry: parentCompany.headquartersCountry,
                headquartersPostalCode: parentCompany.headquartersPostalCode,
                headquartersStreet: parentCompany.headquartersStreet,
              },
            },
          }
        : undefined,

      // -------------------
      // Campuses
      // -------------------
      campuses: campuses?.length
        ? {
            create: campuses.map((campus) => ({
              name: campus.create?.name ?? '',
              slug: campus.create?.slug ?? '',
              displayName: campus.create?.displayName,
              description: campus.create?.description,
              street: campus.create?.street ?? '',
              city: campus.create?.city ?? '',
              state: campus.create?.state ?? '',
              postalCode: campus.create?.postalCode ?? '',
              country: campus.create?.country ?? '',
              latitude: campus.create?.latitude,
              longitude: campus.create?.longitude,
              phone: campus.create?.phone,
              email: campus.create?.email,
              timeZone: campus.create?.timeZone,
              visitingHours: campus.create?.visitingHours,
              directionsSummary: campus.create?.directionsSummary,
              bedsTotal: campus.create?.bedsTotal,
              bedsDetox: campus.create?.bedsDetox,
              bedsResidential: campus.create?.bedsResidential,
              bedsOutpatientCapacity: campus.create?.bedsOutpatientCapacity,
              acceptsWalkIns: campus.create?.acceptsWalkIns,
              hasOnsiteMD: campus.create?.hasOnsiteMD,
              hasTwentyFourHourNursing: campus.create?.hasTwentyFourHourNursing,
              primaryEnvironment: campus.create?.primaryEnvironmentSlug
                ? {
                    connectOrCreate: {
                      where: {
                        slug: campus.create.primaryEnvironmentSlug,
                      },
                      create: {
                        slug: campus.create.primaryEnvironmentSlug,
                        displayName: campus.create.primaryEnvironmentSlug,
                      },
                    },
                  }
                : undefined,
              primarySettingStyle: campus.create?.primarySettingStyleSlug
                ? {
                    connectOrCreate: {
                      where: {
                        slug: campus.create.primarySettingStyleSlug,
                      },
                      create: {
                        slug: campus.create.primarySettingStyleSlug,
                        displayName: campus.create.primarySettingStyleSlug,
                      },
                    },
                  }
                : undefined,
              primaryLuxuryTier: campus.create?.primaryLuxuryTierSlug
                ? {
                    connectOrCreate: {
                      where: {
                        slug: campus.create.primaryLuxuryTierSlug,
                      },
                      create: {
                        slug: campus.create.primaryLuxuryTierSlug,
                        displayName: campus.create.primaryLuxuryTierSlug,
                      },
                    },
                  }
                : undefined,
            })),
          }
        : undefined,

      // -------------------
      // Accreditations (join)
      // -------------------
      orgAccreditations: accreditations?.length
        ? {
            create: accreditations.map((acc) => ({
              accreditation: {
                connectOrCreate: {
                  where: { slug: acc.slug },
                  create: {
                    slug: acc.slug,
                    displayName: acc.displayName ?? acc.slug,
                    description: acc.description,
                  },
                },
              },
            })),
          }
        : undefined,

      // -------------------
      // Reviews / Testimonials / Stories
      // -------------------
      orgReviews: reviews?.length
        ? {
            create: reviews.map((r) => ({
              rating: r.rating,
              title: r.title,
              body: r.body,
              reviewerType: r.reviewerType,
              reviewerName: r.reviewerName,
              reviewerRole: r.reviewerRole,
              source: r.source,
              externalUrl: r.externalUrl,
              isFeatured: r.isFeatured ?? false,
              isVerified: r.isVerified ?? false,
            })),
          }
        : undefined,

      orgTestimonials: testimonials?.length
        ? {
            create: testimonials.map((t) => ({
              quote: t.quote,
              attributionName: t.attributionName,
              attributionRole: t.attributionRole,
              source: t.source,
              isFeatured: t.isFeatured ?? false,
            })),
          }
        : undefined,

      orgStories: stories?.length
        ? {
            create: stories.map((s) => ({
              title: s.title,
              slug: s.slug,
              storyType: s.storyType,
              summary: s.summary,
              body: s.body,
              tags: s.tags ?? [],
              isPublic: s.isPublic ?? true,
              isFeatured: s.isFeatured ?? false,
            })),
          }
        : undefined,

      // -------------------
      // High-level flags / vocab joins
      // -------------------
      levelsOfCare: levelsOfCare?.length
        ? {
            create: levelsOfCare.map((loc) => ({
              levelOfCare: {
                connectOrCreate: {
                  where: { slug: loc.slug },
                  create: {
                    slug: loc.slug,
                    displayName: loc.displayName ?? loc.slug,
                    description: loc.description,
                    type: loc.type ?? 'OTHER',
                  },
                },
              },
            })),
          }
        : undefined,

      detoxServices: detoxServices?.length
        ? {
            create: detoxServices.map((ds) => ({
              detoxService: {
                connectOrCreate: {
                  where: { slug: ds.slug },
                  create: {
                    slug: ds.slug,
                    displayName: ds.displayName ?? ds.slug,
                    description: ds.description,
                  },
                },
              },
            })),
          }
        : undefined,

      services: services?.length
        ? {
            create: services.map((svc) => ({
              service: {
                connectOrCreate: {
                  where: { slug: svc.slug },
                  create: {
                    slug: svc.slug,
                    displayName: svc.displayName ?? svc.slug,
                    description: svc.description,
                  },
                },
              },
            })),
          }
        : undefined,

      populations: populations?.length
        ? {
            create: populations.map((p) => ({
              population: {
                connectOrCreate: {
                  where: { slug: p.slug },
                  create: {
                    slug: p.slug,
                    displayName: p.displayName ?? p.slug,
                    description: p.description,
                  },
                },
              },
            })),
          }
        : undefined,

      languages: languages?.length
        ? {
            create: languages.map((l) => ({
              language: {
                connectOrCreate: {
                  where: { code: l.code },
                  create: {
                    code: l.code,
                    displayName: l.displayName ?? l.code,
                    description: l.description,
                  },
                },
              },
            })),
          }
        : undefined,

      amenities: amenities?.length
        ? {
            create: amenities.map((a) => ({
              amenity: {
                connectOrCreate: {
                  where: { slug: a.slug },
                  create: {
                    slug: a.slug,
                    displayName: a.displayName ?? a.slug,
                    description: a.description,
                  },
                },
              },
            })),
          }
        : undefined,

      environments: environments?.length
        ? {
            create: environments.map((env) => ({
              environment: {
                connectOrCreate: {
                  where: { slug: env.slug },
                  create: {
                    slug: env.slug,
                    displayName: env.displayName ?? env.slug,
                    description: env.description,
                  },
                },
              },
            })),
          }
        : undefined,

      settingStyles: settingStyles?.length
        ? {
            create: settingStyles.map((ss) => ({
              settingStyle: {
                connectOrCreate: {
                  where: { slug: ss.slug },
                  create: {
                    slug: ss.slug,
                    displayName: ss.displayName ?? ss.slug,
                    description: ss.description,
                  },
                },
              },
            })),
          }
        : undefined,

      luxuryTiers: luxuryTiers?.length
        ? {
            create: luxuryTiers.map((lt) => ({
              luxuryTier: {
                connectOrCreate: {
                  where: { slug: lt.slug },
                  create: {
                    slug: lt.slug,
                    displayName: lt.displayName ?? lt.slug,
                    rank: lt.rank,
                    description: lt.description,
                  },
                },
              },
            })),
          }
        : undefined,

      programFeaturesGlobal: programFeaturesGlobal?.length
        ? {
            create: programFeaturesGlobal.map((pf) => ({
              programFeature: {
                connectOrCreate: {
                  where: { slug: pf.slug },
                  create: {
                    slug: pf.slug,
                    displayName: pf.displayName ?? pf.slug,
                    description: pf.description,
                  },
                },
              },
            })),
          }
        : undefined,

      // -------------------
      // Finance edges
      // -------------------
      insurancePayers: insurancePayers?.length
        ? {
            create: insurancePayers.map((ip) => ({
              scope: ip.scope ?? 'ORG',
              networkStatus: ip.networkStatus ?? 'UNKNOWN',
              averageAdmissionPrice: ip.averageAdmissionPrice,
              estimatedPatientOopMin: ip.estimatedPatientOopMin,
              estimatedPatientOopMax: ip.estimatedPatientOopMax,
              requiresPreauth: ip.requiresPreauth,
              acceptsOutOfNetworkWithOopCap: ip.acceptsOutOfNetworkWithOopCap,
              notes: ip.notes,
              overview: ip.overview,
              insurancePayer: {
                connectOrCreate: {
                  where: ip.insurancePayer.id
                    ? { id: ip.insurancePayer.id }
                    : { slug: ip.insurancePayer.slug! },
                  create: {
                    slug: ip.insurancePayer.slug!,
                    companyName:
                      ip.insurancePayer.companyName ?? ip.insurancePayer.slug!,
                    displayName:
                      ip.insurancePayer.displayName ?? ip.insurancePayer.slug!,
                    description: ip.insurancePayer.description,
                    payerType: ip.insurancePayer.payerType,
                  },
                },
              },
            })),
          }
        : undefined,

      paymentOptions: paymentOptions?.length
        ? {
            create: paymentOptions.map((po) => ({
              descriptionOverride: po.descriptionOverride,
              paymentOption: {
                connectOrCreate: {
                  where: po.paymentOption.id
                    ? { id: po.paymentOption.id }
                    : { slug: po.paymentOption.slug! },
                  create: {
                    slug: po.paymentOption.slug!,
                    displayName:
                      po.paymentOption.displayName ?? po.paymentOption.slug!,
                    description: po.paymentOption.description,
                  },
                },
              },
            })),
          }
        : undefined,

      // -------------------
      // Media
      // -------------------
      youtubeChannels: youtubeChannels?.length
        ? {
            connectOrCreate: youtubeChannels.map((ch) => ({
              where: { id: ch.id },
              create: {
                url: ch.url,
              },
            })),
          }
        : undefined,

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
    };
  };

  const nested = buildNested();

  // Core scalar fields (no Prisma type here; plain object)
  const core = {
    ...(rehabCore.state !== undefined && { state: rehabCore.state }),
    ...(rehabCore.city !== undefined && { city: rehabCore.city }),
    ...(rehabCore.zip !== undefined && { zip: rehabCore.zip }),
    ...(rehabCore.country !== undefined && { country: rehabCore.country }),
    ...(rehabCore.name !== undefined && { name: rehabCore.name }),
    ...(rehabCore.slug !== undefined && { slug: rehabCore.slug }),
    ...(rehabCore.legalName !== undefined && {
      legalName: rehabCore.legalName,
    }),
    ...(rehabCore.npi_number !== undefined && {
      npi_number: rehabCore.npi_number,
    }),
    ...(rehabCore.description !== undefined && {
      description: rehabCore.description,
    }),
    ...(rehabCore.tagline !== undefined && { tagline: rehabCore.tagline }),
    ...(rehabCore.websiteUrl !== undefined && {
      websiteUrl: rehabCore.websiteUrl,
    }),
    ...(rehabCore.mainPhone !== undefined && {
      mainPhone: rehabCore.mainPhone,
    }),
    ...(rehabCore.mainEmail !== undefined && {
      mainEmail: rehabCore.mainEmail,
    }),
    ...(rehabCore.yearFounded !== undefined && {
      yearFounded: rehabCore.yearFounded,
    }),
    ...(rehabCore.isNonProfit !== undefined && {
      isNonProfit: rehabCore.isNonProfit,
    }),
    ...(rehabCore.verifiedExists !== undefined && {
      verifiedExists: rehabCore.verifiedExists,
    }),
    ...(rehabCore.primarySourceUrl !== undefined && {
      primarySourceUrl: rehabCore.primarySourceUrl,
    }),
    ...(rehabCore.otherSourceUrls !== undefined && {
      otherSourceUrls: rehabCore.otherSourceUrls,
    }),
    ...(rehabCore.baseCurrency !== undefined && {
      baseCurrency: rehabCore.baseCurrency,
    }),
    ...(rehabCore.fullPrivatePrice !== undefined && {
      fullPrivatePrice: rehabCore.fullPrivatePrice,
    }),
    ...(rehabCore.defaultTimeZone !== undefined && {
      defaultTimeZone: rehabCore.defaultTimeZone,
    }),
  };

  const createData = {
    ...core,
    ...nested,
  };

  const updateData = {
    ...core,
    ...nested,
  };

  const rehabOrg = await prisma.rehabOrg.upsert({
    where: { id },
    create: createData as Prisma.RehabOrgCreateInput,
    update: updateData as Prisma.RehabOrgUpdateInput,
  });

  return rehabOrg;
}
