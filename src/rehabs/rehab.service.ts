import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { UpsertRehabProgramInput } from './rehab-program.upsert.inputs';
import { UpsertRehabCampusInput } from './rehab-campus.upsert.inputs';
import { UpsertRehabOrgInput } from './rehab-org.upsert.inputs';
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
  Prisma,
  PrismaClient,
} from 'prisma/generated/client';

import {
  RehabProgramFilterInput,
  RehabCampusFilterInput,
  RehabOrgFilterInput,
  StringFilter,
  IntRangeFilter,
  FloatRangeFilter,
} from './rehab-filters.input';

import { upsertRehabCampusesWithConnectOrCreate } from './utils/upsertRehabCampusUtils';

import { upsertRehabOrgsWithConnectOrCreate } from './utils/upsertRehabOrgUtils';
import { findManyRehabProgramsWithFilter } from './utils/findManyRehabProgramsUtils';
import { findManyRehabCampusesWithFilter } from './utils/findManyRehabCampusesUtils';
import { upsertRehabProgramsWithConnectOrCreate } from './utils/upsertRehabProgramUtils';
import { findManyRehabOrgsWithFilter } from './utils/findManyRehabOrgsUtils';
import { CreateRehabOrgInput } from './rehab-org-create.input';
import {
  CreateRehabCampusInput,
  CreateRehabProgramInput,
} from './rehab-program-create.input';
import { createRehabCampus } from './utils/createRehabCampusUtils';
import { createRehabProgram } from './utils/createRehabProgramUtils';
import { createRehabOrg } from './utils/createRehabOrgUtils';
function humanizeSlug(s: string) {
  return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

@Injectable()
export class RehabService {
  // Cache TTLs (in milliseconds)
  private readonly CACHE_TTL_REHAB = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_TTL_LIST = 5 * 60 * 1000; // 5 minutes
  private readonly CACHE_TTL_RELATIONS = 5 * 60 * 1000; // 5 minutes

  private readonly INCLUDE_RELATIONS_REHAB_ORG = {
    parentCompany: true,
    orgAccreditations: true,
    campuses: true,
    orgReviews: true,
    orgTestimonials: true,
    orgStories: true,
    insurancePayers: true,
    paymentOptions: true,
    levelsOfCare: true,
    detoxServices: true,
    services: true,
    populations: true,
    amenities: true,
    environments: true,
    settingStyles: true,
    luxuryTiers: true,
    programFeaturesGlobal: true,
    youtubeChannels: true,
    socialMediaProfiles: true,
  };

  private readonly INCLUDE_RELATIONS_REHAB_CAMPUS = {
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

  private readonly INCLUDE_RELATIONS_REHAB_PROGRAM = {
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

  async upsertRehabOrgWithConnectOrCreate(
    input: UpsertRehabOrgInput,
  ): Promise<RehabOrgModel> {
    const rehabOrg = await upsertRehabOrgsWithConnectOrCreate(
      this.prisma,
      input,
    );

    return rehabOrg;
  }

  async upsertRehabCampusWithConnectOrCreate(
    data: UpsertRehabCampusInput,
  ): Promise<RehabCampusModel> {
    const rehabCampus = await upsertRehabCampusesWithConnectOrCreate(
      this.prisma,
      data,
    );

    return rehabCampus;
  }

  // ------------------------------------------------------------------
  // UPSERT: RehabProgram with nested connectOrCreate
  // ------------------------------------------------------------------
  async upsertRehabProgramWithConnectOrCreate(
    data: UpsertRehabProgramInput,
  ): Promise<RehabProgramModel> {
    const rehabProgram = await upsertRehabProgramsWithConnectOrCreate(
      this.prisma,
      data,
    );

    return rehabProgram;
  }

  // Fix the Input types for ConnectOrCreate . Moving on for now for the Ingestion Agent.

  async findManyRehabOrgs(
    filters?: RehabOrgFilterInput,
  ): Promise<RehabOrgModel[]> {
    const rehabOrgs = await findManyRehabOrgsWithFilter(
      this.prisma,
      filters,
      this.cacheManager,
      (prefix, ...parts) => this.getCacheKey(prefix, ...parts),
      this.CACHE_TTL_RELATIONS,
    );

    return rehabOrgs;
  }

  async findManyRehabCampuses(
    filters?: RehabCampusFilterInput,
  ): Promise<RehabCampusModel[]> {
    const rehabCampuses = await findManyRehabCampusesWithFilter(
      this.prisma,
      filters,
      this.cacheManager,
      (prefix, ...parts) => this.getCacheKey(prefix, ...parts),
      this.CACHE_TTL_RELATIONS,
    );

    return rehabCampuses;
  }

  async findManyRehabPrograms(
    filters?: RehabProgramFilterInput,
  ): Promise<RehabProgramModel[]> {
    const rehabPrograms = await findManyRehabProgramsWithFilter(
      this.prisma,
      filters,
      this.cacheManager,
      (prefix, ...parts) => this.getCacheKey(prefix, ...parts),
      this.CACHE_TTL_RELATIONS,
    );

    return rehabPrograms;
  }

  async createRehabCampusWithConnectOrCreate(
    data: CreateRehabCampusInput,
  ): Promise<RehabCampusModel> {
    const rehabCampus = await createRehabCampus(this.prisma, data);

    return rehabCampus;
  }

  async createRehabProgramWithConnectOrCreate(
    data: CreateRehabProgramInput,
  ): Promise<RehabProgramModel> {
    const rehabProgram = await createRehabProgram(this.prisma, data);

    return rehabProgram;
  }

  async createRehabOrgWithConnectOrCreate(
    data: CreateRehabOrgInput,
  ): Promise<RehabOrgModel> {
    const rehabOrg = await createRehabOrg(this.prisma, data);

    return rehabOrg;
  }

  async findRehabOrgById(id: string): Promise<RehabOrgModel> {
    if (!id) {
      throw new Error('Missing ID for this route');
    }

    const rehabOrg = await this.prisma.rehabOrg.findUniqueOrThrow({
      where: { id },
      include: this.INCLUDE_RELATIONS_REHAB_ORG,
    });

    return rehabOrg;
  }

  async findRehabCampusById(id: string): Promise<RehabCampusModel> {
    if (!id) {
      throw new Error('Missing campus id for this route');
    }

    const rehabCampus = await this.prisma.rehabCampus.findFirstOrThrow({
      where: { id },
      include: this.INCLUDE_RELATIONS_REHAB_CAMPUS,
    });
    return rehabCampus;
  }

  async findParentCompanyById(id: string): Promise<ParentCompanyModel> {
    if (!id) {
      throw new Error('Missing id for parent company in this route');
    }

    const parentCompany = await this.prisma.parentCompany.findFirstOrThrow({
      where: { id },
    });

    return parentCompany;
  }

  async findRehabProgramById(id: string) {
    if (!id) {
      throw new Error('Missing id in this route for RehabProgram');
    }

    const rehabProgram = await this.prisma.rehabProgram.findFirstOrThrow({
      where: { id },
      include: this.INCLUDE_RELATIONS_REHAB_PROGRAM,
    });

    return rehabProgram;
  }

  // ============================================
  // DELETE METHODS
  // ============================================

  async deleteRehabOrg(id: string): Promise<{ id: string } | null> {
    const rehabOrg = await this.prisma.rehabOrg.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!rehabOrg) {
      return null;
    }

    await this.prisma.rehabOrg.delete({ where: { id } });

    return { id };
  }

  async deleteRehabCampus(id: string): Promise<{ id: string } | null> {
    const rehabCampus = await this.prisma.rehabCampus.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!rehabCampus) {
      return null;
    }

    await this.prisma.rehabCampus.delete({ where: { id } });

    return { id };
  }

  async deleteRehabProgram(id: string): Promise<{ id: string } | null> {
    const rehabProgram = await this.prisma.rehabProgram.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!rehabProgram) {
      return null;
    }

    await this.prisma.rehabProgram.delete({ where: { id } });

    return { id };
  }

  async deleteParentCompany(id: string): Promise<{ id: string } | null> {
    const parentCompany = await this.prisma.parentCompany.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!parentCompany) {
      return null;
    }

    await this.prisma.parentCompany.delete({ where: { id } });

    return { id };
  }

  // ============================================
  // RELATIONSHIP LOADERS (for Field Resolvers)
  // ============================================

  async getAllInsurancePayers(): Promise<InsurancePayerModel[]> {
    const cacheKey = this.getCacheKey('all:insurancePayers');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as InsurancePayerModel[];
    }

    const insurancePayers = await this.prisma.insurancePayer.findMany({});

    await this.cacheManager.set(cacheKey, insurancePayers, this.CACHE_TTL_LIST);
    return insurancePayers;
  }

  async getAllPaymentOptions(): Promise<PaymentOptionModel[]> {
    const cacheKey = this.getCacheKey('all:paymentOptions');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as PaymentOptionModel[];
    }

    const paymentOptions = await this.prisma.paymentOption.findMany({});

    await this.cacheManager.set(
      cacheKey,
      paymentOptions,
      this.CACHE_TTL_RELATIONS,
    );
    return paymentOptions;
  }

  async getAllLevelsOfCare(): Promise<LevelOfCareModel[]> {
    const cacheKey = this.getCacheKey('all:levelsOfCare');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as LevelOfCareModel[];
    }

    const levelsOfCare = await this.prisma.levelOfCare.findMany({});
    await this.cacheManager.set(
      cacheKey,
      levelsOfCare,
      this.CACHE_TTL_RELATIONS,
    );
    return levelsOfCare;
  }

  async getAllServices(): Promise<ServiceModel[]> {
    const cacheKey = this.getCacheKey('all:services');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as ServiceModel[];
    }

    const allServices = await this.prisma.service.findMany({});

    await this.cacheManager.set(
      cacheKey,
      allServices,
      this.CACHE_TTL_RELATIONS,
    );
    return allServices;
  }

  async getAllDetoxServices(): Promise<DetoxServiceModel[]> {
    const cacheKey = this.getCacheKey('all:detoxServices');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as DetoxServiceModel[];
    }

    const allDetoxServices = await this.prisma.detoxService.findMany({});

    await this.cacheManager.set(
      cacheKey,
      allDetoxServices,
      this.CACHE_TTL_RELATIONS,
    );
    return allDetoxServices;
  }

  async getAllMATTypeModels(): Promise<MATTypeModel[]> {
    const cacheKey = this.getCacheKey('all:mattypeModels');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as MATTypeModel[];
    }

    const allMATTypeModels = await this.prisma.mATType.findMany({});

    await this.cacheManager.set(
      cacheKey,
      allMATTypeModels,
      this.CACHE_TTL_RELATIONS,
    );
    return allMATTypeModels;
  }

  async getAllSubstances(): Promise<SubstanceModel[]> {
    const cacheKey = this.getCacheKey('all:substances');

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached as SubstanceModel[];
    }

    const substances = await this.prisma.substance.findMany({});

    await this.cacheManager.set(cacheKey, substances, this.CACHE_TTL_LIST);

    return substances;
  }

  async getAllPopulations(): Promise<PopulationModel[]> {
    const cacheKey = this.getCacheKey('all:populations');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as PopulationModel[];
    }

    const population = await this.prisma.population.findMany({});

    await this.cacheManager.set(cacheKey, population, this.CACHE_TTL_LIST);
    return population;
  }

  async getAllAccreditations(): Promise<AccreditationModel[]> {
    const cacheKey = this.getCacheKey('all:accreditations');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AccreditationModel[];
    }

    const relations = await this.prisma.accreditation.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllLanguages(): Promise<LanguageModel[]> {
    const cacheKey = this.getCacheKey('all:languages');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as LanguageModel[];
    }

    const relations = await this.prisma.language.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllAmenities(): Promise<AmenityModel[]> {
    const cacheKey = this.getCacheKey('all:amenities');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AmenityModel[];
    }

    const relations = await this.prisma.amenity.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllEnvironments(): Promise<EnvironmentModel[]> {
    const cacheKey = this.getCacheKey('all:environments');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as EnvironmentModel[];
    }

    const relations = await this.prisma.environment.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllSettingStyles(): Promise<SettingStyleModel[]> {
    const cacheKey = this.getCacheKey('all:settingStyles');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as SettingStyleModel[];
    }

    const relations = await this.prisma.settingStyle.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllLuxuryTiers(): Promise<LuxuryTierModel[]> {
    const cacheKey = this.getCacheKey('all:luxuryTiers');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as LuxuryTierModel[];
    }

    const relations = await this.prisma.luxuryTier.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async getAllProgramFeatures(): Promise<ProgramFeatureModel[]> {
    const cacheKey = this.getCacheKey('all:programFeatures');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as ProgramFeatureModel[];
    }

    const relations = await this.prisma.programFeature.findMany({});

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
