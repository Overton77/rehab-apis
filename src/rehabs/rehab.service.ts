import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import {
  Prisma,
  Rehab as RehabModel,
  RehabInsurancePayer as RehabInsurancePayerModel,
  RehabPaymentOption as RehabPaymentOptionModel,
  RehabLevelOfCare as RehabLevelOfCareModel,
  RehabService as RehabServiceModel,
  RehabDetoxService as RehabDetoxServiceModel,
  RehabPopulation as RehabPopulationModel,
  RehabAccreditation as RehabAccreditationModel,
  RehabLanguage as RehabLanguageModel,
  RehabAmenity as RehabAmenityModel,
  RehabEnvironment as RehabEnvironmentModel,
  RehabSettingStyle as RehabSettingStyleModel,
  RehabLuxuryTier as RehabLuxuryTierModel,
  RehabProgramFeature as RehabProgramFeatureModel,
} from '@prisma/client';
import {
  RehabFiltersInput,
  RehabFindOneInput,
  RehabCreateWithLookupsInput,
} from './rehab-filters.input';
import { RehabCreateInput } from 'src/@generated/rehab/rehab-create.input';
import { RehabUpdateInput } from 'src/@generated/rehab/rehab-update.input';

@Injectable()
export class RehabService {
  // Cache TTLs (in milliseconds)
  private readonly CACHE_TTL_REHAB = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_TTL_LIST = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_TTL_RELATIONS = 5 * 60 * 1000; // 5 minutes

  private readonly INCLUDE_RELATIONS = {
    insurancePayers: {
      include: { insurancePayer: true },
    },
    paymentOptions: {
      include: { paymentOption: true },
    },
    levelsOfCare: {
      include: { levelOfCare: true },
    },
    services: {
      include: { service: true },
    },
    detoxServices: {
      include: { detoxService: true },
    },
    populations: {
      include: { population: true },
    },
    accreditations: {
      include: { accreditation: true },
    },
    languages: {
      include: { language: true },
    },
    amenities: {
      include: { amenity: true },
    },
    environments: {
      include: { environment: true },
    },
    settingStyles: {
      include: { settingStyle: true },
    },
    luxuryTiers: {
      include: { luxuryTier: true },
    },
    programFeatures: {
      include: { programFeature: true },
    },
  } as Prisma.RehabInclude;

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ============================================
  // CACHE KEY GENERATORS
  // ============================================

  private getCacheKey(
    prefix: string,
    ...parts: (string | number | object)[]
  ): string {
    const key = parts
      .map((part) =>
        typeof part === 'object' ? JSON.stringify(part) : String(part),
      )
      .join(':');
    return `${prefix}:${key}`;
  }
  private mapRehabUpdateInputToPrisma(
    input: RehabUpdateInput,
  ): Prisma.RehabUpdateInput {
    const {
      id: __,
      otherSourceUrls,
      fullPrivatePrice,
      createdAt,
      updatedAt,
      ...rest
    } = input;

    const data: Prisma.RehabUpdateInput = {
      ...rest,
    };

    if (otherSourceUrls) {
      data.otherSourceUrls = otherSourceUrls;
    }

    if (fullPrivatePrice) {
      data.fullPrivatePrice = fullPrivatePrice;
    }

    if (createdAt) {
      data.createdAt = createdAt;
    }

    if (updatedAt) {
      data.updatedAt = updatedAt;
    }

    return data;
  }

  private mapCreateInputToPrisma(
    input: RehabCreateInput,
  ): Prisma.RehabCreateInput {
    const { id, createdAt, updatedAt, otherSourceUrls, ...rest } = input;

    const data: Prisma.RehabCreateInput = {
      ...rest,
    };

    if (id) {
      data.id = id;
    }

    // otherSourceUrls is generated as an input type, usually `{ set?: string[] }`
    if (otherSourceUrls?.set) {
      data.otherSourceUrls = otherSourceUrls.set;
    }

    // Let Prisma defaults handle createdAt/updatedAt unless explicitly provided
    if (createdAt) {
      data.createdAt = new Date(createdAt);
    }
    if (updatedAt) {
      data.updatedAt = new Date(updatedAt);
    }

    return data;
  }

  private buildFindManyRehabWhereClause(
    filters?: RehabFiltersInput,
  ): Prisma.RehabWhereInput {
    if (!filters) return {};

    const where: Prisma.RehabWhereInput = {};

    // SCALAR FILTERS
    if (filters.states?.length) {
      where.state = { in: filters.states };
    }

    if (filters.cities?.length) {
      where.city = { in: filters.cities };
    }

    if (typeof filters.verifiedExists === 'boolean') {
      where.verifiedExists = filters.verifiedExists;
    }

    if (filters.search) {
      const search = filters.search.trim();
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // RELATION FILTERS (many-to-many via join tables)
    // NOTE: these use the *join* model’s foreign key field names

    if (filters.programFeatureIds?.length) {
      where.programFeatures = {
        some: {
          programFeatureId: { in: filters.programFeatureIds },
        },
      };
    }

    if (filters.settingStyleIds?.length) {
      where.settingStyles = {
        some: {
          settingStyleId: { in: filters.settingStyleIds },
        },
      };
    }

    if (filters.insurancePayerIds?.length) {
      where.insurancePayers = {
        some: {
          insurancePayerId: { in: filters.insurancePayerIds },
        },
      };
    }

    if (filters.paymentOptionIds?.length) {
      where.paymentOptions = {
        some: {
          paymentOptionId: { in: filters.paymentOptionIds },
        },
      };
    }

    if (filters.levelOfCareIds?.length) {
      where.levelsOfCare = {
        some: {
          levelOfCareId: { in: filters.levelOfCareIds },
        },
      };
    }

    if (filters.serviceIds?.length) {
      where.services = {
        some: {
          serviceId: { in: filters.serviceIds },
        },
      };
    }

    if (filters.detoxServiceIds?.length) {
      where.detoxServices = {
        some: {
          detoxServiceId: { in: filters.detoxServiceIds },
        },
      };
    }

    if (filters.populationIds?.length) {
      where.populations = {
        some: {
          populationId: { in: filters.populationIds },
        },
      };
    }

    if (filters.accreditationIds?.length) {
      where.accreditations = {
        some: {
          accreditationId: { in: filters.accreditationIds },
        },
      };
    }

    if (filters.languageIds?.length) {
      where.languages = {
        some: {
          languageId: { in: filters.languageIds },
        },
      };
    }

    if (filters.amenityIds?.length) {
      where.amenities = {
        some: {
          amenityId: { in: filters.amenityIds },
        },
      };
    }

    if (filters.environmentIds?.length) {
      where.environments = {
        some: {
          environmentId: { in: filters.environmentIds },
        },
      };
    }

    if (filters.luxuryTierIds?.length) {
      where.luxuryTiers = {
        some: {
          luxuryTierId: { in: filters.luxuryTierIds },
        },
      };
    }

    return where;
  }

  private buildFindOneRehabWhereClause(
    filters?: RehabFindOneInput,
  ): Prisma.RehabWhereInput {
    if (!filters) return {};

    const where: Prisma.RehabWhereInput = {};

    // SCALAR FILTERS
    if (filters.state) {
      where.state = filters.state;
    }

    if (filters.city) {
      where.city = filters.city;
    }

    if (typeof filters.verifiedExists === 'boolean') {
      where.verifiedExists = filters.verifiedExists;
    }

    if (filters.search) {
      const search = filters.search.trim();
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // RELATION FILTERS (many-to-many via join tables)
    // NOTE: these still use the join model’s FK field names

    if (filters.programFeatureId) {
      where.programFeatures = {
        some: {
          programFeatureId: filters.programFeatureId,
        },
      };
    }

    if (filters.settingStyleId) {
      where.settingStyles = {
        some: {
          settingStyleId: filters.settingStyleId,
        },
      };
    }

    if (filters.insurancePayerId) {
      where.insurancePayers = {
        some: {
          insurancePayerId: filters.insurancePayerId,
        },
      };
    }

    if (filters.paymentOptionId) {
      where.paymentOptions = {
        some: {
          paymentOptionId: filters.paymentOptionId,
        },
      };
    }

    if (filters.levelOfCareId) {
      where.levelsOfCare = {
        some: {
          levelOfCareId: filters.levelOfCareId,
        },
      };
    }

    if (filters.serviceId) {
      where.services = {
        some: {
          serviceId: filters.serviceId,
        },
      };
    }

    if (filters.detoxServiceId) {
      where.detoxServices = {
        some: {
          detoxServiceId: filters.detoxServiceId,
        },
      };
    }

    if (filters.populationId) {
      where.populations = {
        some: {
          populationId: filters.populationId,
        },
      };
    }

    if (filters.accreditationId) {
      where.accreditations = {
        some: {
          accreditationId: filters.accreditationId,
        },
      };
    }

    if (filters.languageId) {
      where.languages = {
        some: {
          languageId: filters.languageId,
        },
      };
    }

    if (filters.amenityId) {
      where.amenities = {
        some: {
          amenityId: filters.amenityId,
        },
      };
    }

    if (filters.environmentId) {
      where.environments = {
        some: {
          environmentId: filters.environmentId,
        },
      };
    }

    if (filters.luxuryTierId) {
      where.luxuryTiers = {
        some: {
          luxuryTierId: filters.luxuryTierId,
        },
      };
    }

    return where;
  }

  // ============================================
  // MAIN CRUD OPERATIONS
  // ============================================

  async findMany(params: {
    skip?: number;
    take?: number;
    filters?: RehabFiltersInput;
    orderBy?: Prisma.RehabOrderByWithRelationInput;
  }): Promise<RehabModel[]> {
    const { skip = 0, take = 20, filters } = params;

    const orderBy: Prisma.RehabOrderByWithRelationInput = params.orderBy ?? {
      createdAt: 'desc',
    };

    const cacheKey = this.getCacheKey('rehabs:list', {
      skip,
      take,
      filters,
      orderBy,
    });

    console.log('cacheKey', cacheKey);

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabModel[];
    }

    // Build where clause from your custom filters
    const where = this.buildFindManyRehabWhereClause(filters);

    console.log('where', JSON.stringify(where, null, 2));

    // Fetch from database
    const rehabs = await this.prisma.rehab.findMany({
      where,
      skip,
      take,
      orderBy,
      include: this.INCLUDE_RELATIONS,
    });

    console.log('rehabs', rehabs);

    rehabs.map((rehab) => {
      rehab.insurancePayers.map((payer) => {
        console.log('payer', payer);
      });
    });

    const transformed = rehabs as RehabModel[];

    // Cache the result
    await this.cacheManager.set(cacheKey, transformed, this.CACHE_TTL_LIST);

    return transformed;
  }

  async findOne(params: {
    filters?: RehabFindOneInput;
    orderBy?: Prisma.RehabOrderByWithRelationInput;
  }): Promise<RehabModel | null> {
    const { filters } = params;

    const orderBy: Prisma.RehabOrderByWithRelationInput = params.orderBy ?? {
      createdAt: 'desc',
    };

    const cacheKey = this.getCacheKey('rehabs:one', {
      filters,
      orderBy,
    });

    // Try to get from cache
    const cached = await this.cacheManager.get<RehabModel>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build where clause from your custom filters
    const where = this.buildFindOneRehabWhereClause(filters);

    // Fetch from database
    const rehab = await this.prisma.rehab.findFirst({
      where,
      orderBy,
      include: this.INCLUDE_RELATIONS,
    });

    if (!rehab) {
      return null;
    }

    const transformed = rehab as unknown as RehabModel;

    // Cache the result
    await this.cacheManager.set(cacheKey, transformed, this.CACHE_TTL_REHAB);

    return transformed;
  }

  async findById(id: string): Promise<RehabModel | null> {
    const cacheKey = this.getCacheKey('rehab', id);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabModel;
    }

    const rehab = await this.prisma.rehab.findUnique({
      where: { id },
      include: this.INCLUDE_RELATIONS,
    });
    return rehab;
  }

  async findBySlug(slug: string): Promise<RehabModel | null> {
    const cacheKey = this.getCacheKey('rehab:slug', slug);

    // Try to get from cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabModel;
    }

    // Fetch from database
    const rehab = await this.prisma.rehab.findUnique({
      where: { slug },
      include: this.INCLUDE_RELATIONS,
    });

    if (!rehab) {
      return null;
    }

    // Transform Decimal fields

    // Cache the result
    await this.cacheManager.set(cacheKey, rehab, this.CACHE_TTL_REHAB);

    return rehab;
  }

  async count(filters?: RehabFiltersInput): Promise<number> {
    const cacheKey = this.getCacheKey('rehabs:count', filters ?? {});

    // Try to get from cache
    const cached = await this.cacheManager.get<number>(cacheKey);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const where = this.buildFindManyRehabWhereClause(filters);
    const count = await this.prisma.rehab.count({ where });

    // Cache the result
    await this.cacheManager.set(cacheKey, count, this.CACHE_TTL_LIST);

    return count;
  }

  async createRehabWithNested(data: RehabCreateInput): Promise<RehabModel> {
    const prismaData = this.mapCreateInputToPrisma(data);
    const rehab = await this.prisma.rehab.create({ data: prismaData });

    // Invalidate list caches
    await this.invalidateListCaches();

    return rehab;
  }

  async createManyRehabsWithNested(
    data: RehabCreateInput[],
  ): Promise<RehabModel[]> {
    const operations = data.map((item) =>
      this.prisma.rehab.create({ data: this.mapCreateInputToPrisma(item) }),
    );

    const rehabs = await this.prisma.$transaction(operations);

    await this.invalidateListCaches();

    return rehabs;
  }

  async createRehabWithConnectOrCreate(
    data: RehabCreateWithLookupsInput,
  ): Promise<RehabModel> {
    const {
      insurancePayers,
      paymentOptions,
      levelsOfCare,
      services,
      detoxServices,
      populations,
      accreditations,
      languages,
      amenities,
      environments,
      settingStyles,
      luxuryTiers,
      programFeatures,
      ...rehabCore
    } = data;

    const prismaData: Prisma.RehabCreateInput = {
      ...rehabCore,

      // ---------------------------
      // InsurancePayer (slug @unique)
      // ---------------------------
      insurancePayers: insurancePayers?.length
        ? {
            create: insurancePayers.map((payer) => ({
              insurancePayer: {
                connectOrCreate: {
                  where: { slug: payer.slug },
                  create: {
                    slug: payer.slug,
                    displayName: payer.displayName ?? payer.slug,
                    // popular will default to false
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
              paymentOption: {
                connectOrCreate: {
                  where: { slug: po.slug },
                  create: {
                    slug: po.slug,
                    displayName: po.displayName ?? po.slug,

                    category: 'FINANCIAL_ASSISTANCE',
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
                    displayName: loc.displayName ?? loc.slug,
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
                    displayName: svc.displayName ?? svc.slug,
                    // you can pick a default kind if you want:
                    kind: 'OTHER',
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
                    displayName: ds.displayName ?? ds.slug,
                    // you can derive substance or just reuse slug/displayName for now
                    substance: ds.displayName ?? ds.slug,
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
                    displayName: pop.displayName ?? pop.slug,
                    // pick a default if you don't pass category:
                    category: 'SPECIALTY_PROGRAM',
                  },
                },
              },
            })),
          }
        : undefined,

      // ---------------------------
      // Accreditation (slug @unique)
      // ---------------------------
      accreditations: accreditations?.length
        ? {
            create: accreditations.map((acc) => ({
              accreditation: {
                connectOrCreate: {
                  where: { slug: acc.slug },
                  create: {
                    slug: acc.slug,
                    displayName: acc.displayName ?? acc.slug,
                    acronym: undefined,
                    url: undefined,
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
                    displayName: lang.displayName,
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
                    displayName: a.displayName ?? a.slug,
                    category: 'OTHER', // or smarter default
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
                    displayName: env.displayName ?? env.slug,
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
                    displayName: style.displayName ?? style.slug,
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
                    displayName: tier.displayName,
                    rank: tier.rank,
                  },
                },
              },
            })),
          }
        : undefined,

      // ---------------------------
      // ProgramFeature (slug @unique)
      // ---------------------------
      programFeatures: programFeatures?.length
        ? {
            create: programFeatures.map((pf) => ({
              programFeature: {
                connectOrCreate: {
                  where: { slug: pf.slug },
                  create: {
                    slug: pf.slug,
                    displayName: pf.displayName ?? pf.slug,
                    category: 'OTHER',
                  },
                },
              },
            })),
          }
        : undefined,
    };

    const rehab = await this.prisma.rehab.create({
      data: prismaData,
      include: this.INCLUDE_RELATIONS,
    });

    return rehab;
  }

  async updateRehabWithNested(
    id: string,
    data: RehabUpdateInput,
  ): Promise<RehabModel> {
    const prismaData = this.mapRehabUpdateInputToPrisma(data);

    const rehab = await this.prisma.rehab.update({
      where: { id },
      data: prismaData,
    });

    // Invalidate caches for this rehab
    await this.invalidateRehabCaches(id, rehab.slug);

    return rehab;
  }

  // async updateManyRehabsWithNested();

  async delete(id: string): Promise<RehabModel | null> {
    const rehab = await this.prisma.rehab.findUnique({ where: { id } });
    if (!rehab) {
      return null;
    }

    await this.prisma.rehab.delete({ where: { id } });

    // Invalidate caches
    await this.invalidateRehabCaches(id, rehab.slug);

    return rehab;
  }

  // ============================================
  // RELATIONSHIP LOADERS (for Field Resolvers)
  // ============================================

  async getInsurancePayers(
    rehabId: string,
  ): Promise<RehabInsurancePayerModel[]> {
    const cacheKey = this.getCacheKey('rehab:insurancePayers', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabInsurancePayerModel[];
    }

    const relations = await this.prisma.rehabInsurancePayer.findMany({
      where: { rehabId },
      include: {
        insurancePayer: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getPaymentOptions(rehabId: string): Promise<RehabPaymentOptionModel[]> {
    const cacheKey = this.getCacheKey('rehab:paymentOptions', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabPaymentOptionModel[];
    }

    const relations = await this.prisma.rehabPaymentOption.findMany({
      where: { rehabId },
      include: {
        paymentOption: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getLevelsOfCare(rehabId: string): Promise<RehabLevelOfCareModel[]> {
    const cacheKey = this.getCacheKey('rehab:levelsOfCare', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabLevelOfCareModel[];
    }

    const relations = await this.prisma.rehabLevelOfCare.findMany({
      where: { rehabId },
      include: {
        levelOfCare: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getServices(rehabId: string): Promise<RehabServiceModel[]> {
    const cacheKey = this.getCacheKey('rehab:services', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabServiceModel[];
    }

    const relations = await this.prisma.rehabService.findMany({
      where: { rehabId },
      include: {
        service: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getDetoxServices(rehabId: string): Promise<RehabDetoxServiceModel[]> {
    const cacheKey = this.getCacheKey('rehab:detoxServices', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabDetoxServiceModel[];
    }

    const relations = await this.prisma.rehabDetoxService.findMany({
      where: { rehabId },
      include: {
        detoxService: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getPopulations(rehabId: string): Promise<RehabPopulationModel[]> {
    const cacheKey = this.getCacheKey('rehab:populations', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabPopulationModel[];
    }

    const relations = await this.prisma.rehabPopulation.findMany({
      where: { rehabId },
      include: {
        population: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAccreditations(rehabId: string): Promise<RehabAccreditationModel[]> {
    const cacheKey = this.getCacheKey('rehab:accreditations', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabAccreditationModel[];
    }

    const relations = await this.prisma.rehabAccreditation.findMany({
      where: { rehabId },
      include: {
        accreditation: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getLanguages(rehabId: string): Promise<RehabLanguageModel[]> {
    const cacheKey = this.getCacheKey('rehab:languages', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabLanguageModel[];
    }

    const relations = await this.prisma.rehabLanguage.findMany({
      where: { rehabId },
      include: {
        language: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAmenities(rehabId: string): Promise<RehabAmenityModel[]> {
    const cacheKey = this.getCacheKey('rehab:amenities', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabAmenityModel[];
    }

    const relations = await this.prisma.rehabAmenity.findMany({
      where: { rehabId },
      include: {
        amenity: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getEnvironments(rehabId: string): Promise<RehabEnvironmentModel[]> {
    const cacheKey = this.getCacheKey('rehab:environments', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabEnvironmentModel[];
    }

    const relations = await this.prisma.rehabEnvironment.findMany({
      where: { rehabId },
      include: {
        environment: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getSettingStyles(rehabId: string): Promise<RehabSettingStyleModel[]> {
    const cacheKey = this.getCacheKey('rehab:settingStyles', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabSettingStyleModel[];
    }

    const relations = await this.prisma.rehabSettingStyle.findMany({
      where: { rehabId },
      include: {
        settingStyle: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getLuxuryTiers(rehabId: string): Promise<RehabLuxuryTierModel[]> {
    const cacheKey = this.getCacheKey('rehab:luxuryTiers', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabLuxuryTierModel[];
    }

    const relations = await this.prisma.rehabLuxuryTier.findMany({
      where: { rehabId },
      include: {
        luxuryTier: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getProgramFeatures(
    rehabId: string,
  ): Promise<RehabProgramFeatureModel[]> {
    const cacheKey = this.getCacheKey('rehab:programFeatures', rehabId);

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as RehabProgramFeatureModel[];
    }

    const relations = await this.prisma.rehabProgramFeature.findMany({
      where: { rehabId },
      include: {
        programFeature: true,
      },
    });

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  // Cache invalidation helpers
  private async invalidateRehabCaches(id: string, slug: string): Promise<void> {
    // Invalidate specific rehab caches
    await this.cacheManager.del(this.getCacheKey('rehab', id));
    await this.cacheManager.del(this.getCacheKey('rehab:slug', slug));

    // Invalidate all relationship caches for this rehab
    const relationTypes = [
      'insurancePayers',
      'paymentOptions',
      'levelsOfCare',
      'services',
      'detoxServices',
      'populations',
      'accreditations',
      'languages',
      'amenities',
      'environments',
      'settingStyles',
      'luxuryTiers',
      'programFeatures',
    ];

    for (const relationType of relationTypes) {
      await this.cacheManager.del(
        this.getCacheKey(`rehab:${relationType}`, id),
      );
    }

    // Invalidate list caches
    await this.invalidateListCaches();
  }

  private async invalidateListCaches(): Promise<void> {
    // Note: In production, you might want a more sophisticated cache invalidation strategy
    // For now, we'll invalidate specific list cache patterns
    // You may want to track keys more explicitly or use Redis SCAN for pattern deletion

    // Delete common list cache keys (simplified approach)
    const listCacheKeys = ['rehabs:list', 'rehabs:count'];

    for (const key of listCacheKeys) {
      await this.cacheManager.del(key);
    }
  }
}
