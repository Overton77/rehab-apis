import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { UpsertRehabProgramInput } from './rehab-program.upsert.inputs';
import { UpsertRehabCampusInput } from './rehab-campus.upsert.inputs';
import { UpsertRehabOrgInput } from './rehab-org.upsert.inputs';
import {
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

import {
  RehabProgramFilterInput,
  RehabCampusFilterInput,
  RehabOrgFilterInput,
} from './rehab-filters.input';
import {
  bumpListTag,
  REHAB_CAMPUS_LIST_TAG_KEY,
  REHAB_ORG_LIST_TAG_KEY,
  REHAB_PROGRAM_LIST_TAG_KEY,
} from './utils/cache/rehab-cache.util';

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

import {
  LevelOfCareCreateInput,
  DetoxServiceCreateInput,
  MATTypeCreateInput,
  ServiceCreateInput,
  PopulationCreateInput,
  AccreditationCreateInput,
  LanguageCreateInput,
  AmenityCreateInput,
  EnvironmentCreateInput,
  SettingStyleCreateInput,
  LuxuryTierCreateInput,
  ProgramFeatureCreateInput,
  PaymentOptionCreateInput,
  InsurancePayerCreateInput,
  SubstanceCreateInput,
} from './rehab-taxonomy.inputs';

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

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_ORG_LIST_TAG_KEY);
    }

    return rehabOrg;
  }

  async upsertRehabCampusWithConnectOrCreate(
    data: UpsertRehabCampusInput,
  ): Promise<RehabCampusModel> {
    const rehabCampus = await upsertRehabCampusesWithConnectOrCreate(
      this.prisma,
      data,
    );

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_CAMPUS_LIST_TAG_KEY);
    }

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

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_PROGRAM_LIST_TAG_KEY);
    }

    return rehabProgram;
  }

  // Fix the Input types for ConnectOrCreate . Moving on for now for the Ingestion Agent.

  async findManyRehabOrgs(
    filters?: RehabOrgFilterInput,
  ): Promise<RehabOrgModel[]> {
    const { skip = 0, take = 20, ...rest } = filters ?? {};
    const all = await findManyRehabOrgsWithFilter(
      this.prisma,
      { ...rest },
      this.cacheManager,
      this.CACHE_TTL_RELATIONS,
    );
    const rehabOrgs = all.slice(skip, skip + take);
    return rehabOrgs;
  }

  async findManyRehabCampuses(
    filters?: RehabCampusFilterInput,
  ): Promise<RehabCampusModel[]> {
    const { skip = 0, take = 20, ...rest } = filters ?? {};

    const all = await findManyRehabCampusesWithFilter(
      this.prisma,
      { ...rest },
      this.cacheManager,
      this.CACHE_TTL_RELATIONS,
    );

    const rehabCampuses = all.slice(skip, skip + take);

    return rehabCampuses;
  }

  async findManyRehabPrograms(
    filters?: RehabProgramFilterInput,
  ): Promise<RehabProgramModel[]> {
    const { skip = 0, take = 20, ...rest } = filters ?? {};
    const all = await findManyRehabProgramsWithFilter(
      this.prisma,
      { ...rest },
      this.cacheManager,
      this.CACHE_TTL_RELATIONS,
    );

    const rehabPrograms = all.slice(skip, skip + take);
    return rehabPrograms;
  }

  async createRehabCampusWithConnectOrCreate(
    data: CreateRehabCampusInput,
  ): Promise<RehabCampusModel> {
    const rehabCampus = await createRehabCampus(this.prisma, data);

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_CAMPUS_LIST_TAG_KEY);
    }

    return rehabCampus;
  }

  async createRehabProgramWithConnectOrCreate(
    data: CreateRehabProgramInput,
  ): Promise<RehabProgramModel> {
    const rehabProgram = await createRehabProgram(this.prisma, data);

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_PROGRAM_LIST_TAG_KEY);
    }

    return rehabProgram;
  }

  async createRehabOrgWithConnectOrCreate(
    data: CreateRehabOrgInput,
  ): Promise<RehabOrgModel> {
    const rehabOrg = await createRehabOrg(this.prisma, data);
    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_ORG_LIST_TAG_KEY);
    }

    return rehabOrg;
  }

  async findRehabOrgById(id: string): Promise<RehabOrgModel> {
    if (!id) {
      throw new Error('Missing ID for this route');
    }

    const cacheKey = this.getCacheKey('rehab', id);

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached as RehabOrgModel;
    }

    const rehabOrg = await this.prisma.rehabOrg.findUniqueOrThrow({
      where: { id },
      include: this.INCLUDE_RELATIONS_REHAB_ORG,
    });

    await this.cacheManager.set(cacheKey, rehabOrg, 120);

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

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_ORG_LIST_TAG_KEY);
    }

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

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_CAMPUS_LIST_TAG_KEY);
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

    if (this.cacheManager) {
      await bumpListTag(this.cacheManager, REHAB_PROGRAM_LIST_TAG_KEY);
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

  // Lookup tables and filters.

  async createManyLevelOfCare(
    items: LevelOfCareCreateInput[],
  ): Promise<LevelOfCareModel[]> {
    await this.prisma.levelOfCare.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);

    if (this.cacheManager) {
      await this.cacheManager.del('all:levelsOfCare');
    }

    return await this.prisma.levelOfCare.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- DetoxService ----------
  async createManyDetoxService(items: DetoxServiceCreateInput[]) {
    await this.prisma.detoxService.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.detoxService.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- MATType ----------
  async createManyMATType(items: MATTypeCreateInput[]) {
    await this.prisma.mATType.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.mATType.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Service ----------
  async createManyService(items: ServiceCreateInput[]) {
    await this.prisma.service.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.service.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Population ----------
  async createManyPopulation(items: PopulationCreateInput[]) {
    await this.prisma.population.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.population.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Accreditation ----------
  async createManyAccreditation(items: AccreditationCreateInput[]) {
    await this.prisma.accreditation.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.accreditation.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Language ----------
  async createManyLanguage(items: LanguageCreateInput[]) {
    await this.prisma.language.createMany({
      data: items,
      skipDuplicates: true,
    });

    const codes = items.map((i) => i.code);
    return this.prisma.language.findMany({
      where: { code: { in: codes } },
    });
  }

  // ---------- Amenity ----------
  async createManyAmenity(items: AmenityCreateInput[]) {
    await this.prisma.amenity.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.amenity.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Environment ----------
  async createManyEnvironment(items: EnvironmentCreateInput[]) {
    await this.prisma.environment.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.environment.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- SettingStyle ----------
  async createManySettingStyle(items: SettingStyleCreateInput[]) {
    await this.prisma.settingStyle.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.settingStyle.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- LuxuryTier ----------
  async createManyLuxuryTier(items: LuxuryTierCreateInput[]) {
    await this.prisma.luxuryTier.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.luxuryTier.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- ProgramFeature ----------
  async createManyProgramFeature(items: ProgramFeatureCreateInput[]) {
    await this.prisma.programFeature.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.programFeature.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- PaymentOption ----------
  async createManyPaymentOption(items: PaymentOptionCreateInput[]) {
    await this.prisma.paymentOption.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.paymentOption.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- InsurancePayer ----------
  async createManyInsurancePayer(items: InsurancePayerCreateInput[]) {
    await this.prisma.insurancePayer.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.insurancePayer.findMany({
      where: { slug: { in: slugs } },
    });
  }

  // ---------- Substance ----------
  async createManySubstance(items: SubstanceCreateInput[]) {
    await this.prisma.substance.createMany({
      data: items,
      skipDuplicates: true,
    });

    const slugs = items.map((i) => i.slug);
    return this.prisma.substance.findMany({
      where: { slug: { in: slugs } },
    });
  }

  async findAllInsurancePayers(): Promise<InsurancePayerModel[]> {
    const cacheKey = this.getCacheKey('all:insurancePayers');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as InsurancePayerModel[];
    }

    const insurancePayers = await this.prisma.insurancePayer.findMany({});

    await this.cacheManager.set(cacheKey, insurancePayers, this.CACHE_TTL_LIST);
    return insurancePayers;
  }

  async findAllPaymentOptions(): Promise<PaymentOptionModel[]> {
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

  async findAllLevelsOfCare(): Promise<LevelOfCareModel[]> {
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

  async findAllServices(): Promise<ServiceModel[]> {
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

  async findAllDetoxServices(): Promise<DetoxServiceModel[]> {
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

  async findAllMATTypes(): Promise<MATTypeModel[]> {
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

  async findAllSubstances(): Promise<SubstanceModel[]> {
    const cacheKey = this.getCacheKey('all:substances');

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached as SubstanceModel[];
    }

    const substances = await this.prisma.substance.findMany({});

    await this.cacheManager.set(cacheKey, substances, this.CACHE_TTL_LIST);

    return substances;
  }

  async findAllPopulations(): Promise<PopulationModel[]> {
    const cacheKey = this.getCacheKey('all:populations');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as PopulationModel[];
    }

    const population = await this.prisma.population.findMany({});

    await this.cacheManager.set(cacheKey, population, this.CACHE_TTL_LIST);
    return population;
  }

  async findAllAccreditations(): Promise<AccreditationModel[]> {
    const cacheKey = this.getCacheKey('all:accreditations');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AccreditationModel[];
    }

    const relations = await this.prisma.accreditation.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllLanguages(): Promise<LanguageModel[]> {
    const cacheKey = this.getCacheKey('all:languages');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as LanguageModel[];
    }

    const relations = await this.prisma.language.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllAmenities(): Promise<AmenityModel[]> {
    const cacheKey = this.getCacheKey('all:amenities');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as AmenityModel[];
    }

    const relations = await this.prisma.amenity.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllEnvironments(): Promise<EnvironmentModel[]> {
    const cacheKey = this.getCacheKey('all:environments');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as EnvironmentModel[];
    }

    const relations = await this.prisma.environment.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllSettingStyles(): Promise<SettingStyleModel[]> {
    const cacheKey = this.getCacheKey('all:settingStyles');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as SettingStyleModel[];
    }

    const relations = await this.prisma.settingStyle.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllLuxuryTiers(): Promise<LuxuryTierModel[]> {
    const cacheKey = this.getCacheKey('all:luxuryTiers');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as LuxuryTierModel[];
    }

    const relations = await this.prisma.luxuryTier.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }

  async findAllProgramFeatures(): Promise<ProgramFeatureModel[]> {
    const cacheKey = this.getCacheKey('all:programFeatures');

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as ProgramFeatureModel[];
    }

    const relations = await this.prisma.programFeature.findMany({});

    await this.cacheManager.set(cacheKey, relations, this.CACHE_TTL_RELATIONS);
    return relations;
  }
}
