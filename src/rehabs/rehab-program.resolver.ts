// src/rehabs/rehab-program.resolver.ts
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { RehabService } from './rehab.service';

import { RehabProgram } from './core.model';
import { DeleteResult } from './mutation-results';

import {
  RehabProgramDetoxService,
  RehabProgramService,
  RehabProgramPopulation,
  RehabProgramLanguage,
  RehabProgramAmenity,
  RehabProgramFeature,
  RehabProgramMATType,
  RehabProgramSubstance,
} from './program-joins.model';

import { CreateRehabProgramInput } from './rehab-program-create.input';

import { UpsertRehabProgramInput } from './rehab-program.upsert.inputs';

import { RehabProgramFilterInput } from './rehab-filters.input';

//  TODO ! : Resolve Type fields without include using where: Rehab_type in: {}

@Resolver(() => RehabProgram)
export class RehabProgramResolver {
  constructor(private readonly service: RehabService) {}

  // ============================================
  // QUERIES
  // ============================================

  @Query(() => RehabProgram, {
    description: 'Find a single rehab program by id',
  })
  async findRehabProgramById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RehabProgram> {
    const program = await this.service.findRehabProgramById(id);
    return program;
  }

  @Query(() => [RehabProgram], {
    description: 'Find many rehab programs using complex filters',
  })
  async findManyRehabPrograms(
    @Args('data', { type: () => RehabProgramFilterInput, nullable: true })
    data?: RehabProgramFilterInput,
  ): Promise<RehabProgram[]> {
    const programs = await this.service.findManyRehabPrograms(data);
    return programs;
  }

  // ============================================
  // MUTATIONS
  // ============================================

  @Mutation(() => RehabProgram, {
    description:
      'Create a new rehab program and its nested relationships using connectOrCreate semantics',
  })
  async createRehabProgramWithConnectOrCreate(
    @Args('data', { type: () => CreateRehabProgramInput })
    data: CreateRehabProgramInput,
  ): Promise<RehabProgram> {
    const program =
      await this.service.createRehabProgramWithConnectOrCreate(data);
    return program;
  }

  @Mutation(() => RehabProgram, {
    description:
      'Upsert a rehab program by id, allowing partial updates and nested connectOrCreate for vocab and joins',
  })
  async upsertRehabProgramWithConnectOrCreate(
    @Args('data', { type: () => UpsertRehabProgramInput })
    data: UpsertRehabProgramInput,
  ): Promise<RehabProgram> {
    const program =
      await this.service.upsertRehabProgramWithConnectOrCreate(data);
    return program;
  }

  @Mutation(() => DeleteResult, {
    description: 'Delete a rehab program by id',
  })
  async deleteRehabProgram(
    @Args('id', { type: () => String }) id: string,
  ): Promise<DeleteResult> {
    const result = await this.service.deleteRehabProgram(id);
    // Normalise into DeleteResult shape; assuming DeleteResult has nullable id
    return { id: result?.id ?? null };
  }

  // ============================================
  // FIELD RESOLVERS (prevent N+1, pass-through first)
  // ============================================
  // These will just pass through preloaded relations when the program
  // was fetched with `include`, and you can later add lazy-load behavior
  // if needed (using this.service / prisma in here).

  @ResolveField(() => [RehabProgramDetoxService], {
    nullable: true,
    description: 'Detox services specific to this program',
  })
  programDetoxServices(
    @Parent() program: RehabProgram,
  ): RehabProgramDetoxService[] {
    if (
      program.programDetoxServices &&
      program.programDetoxServices.length > 0
    ) {
      return program.programDetoxServices;
    }
  }

  @ResolveField(() => [RehabProgramService], {
    nullable: true,
    description: 'Therapeutic services in this program',
  })
  programServices(@Parent() program: RehabProgram): RehabProgramService[] {
    if (program.programServices && program.programServices.length > 0) {
      return program.programServices;
    }
  }

  @ResolveField(() => [RehabProgramPopulation], {
    nullable: true,
    description: 'Populations and specialty cohorts for this program',
  })
  programPopulations(
    @Parent() program: RehabProgram,
  ): RehabProgramPopulation[] {
    if (program.programPopulations && program.programPopulations.length > 0) {
      return program.programPopulations;
    }
  }

  @ResolveField(() => [RehabProgramLanguage], {
    nullable: true,
    description: 'Languages available in this program',
  })
  programLanguages(@Parent() program: RehabProgram): RehabProgramLanguage[] {
    if (program.programLanguages && program.programLanguages.length > 0) {
      return program.programLanguages;
    }
  }

  @ResolveField(() => [RehabProgramAmenity], {
    nullable: true,
    description: 'Amenities specific to this program',
  })
  programAmenities(@Parent() program: RehabProgram): RehabProgramAmenity[] {
    if (program.programAmenities && program.programAmenities.length > 0) {
      return program.programAmenities;
    }
  }

  @ResolveField(() => [RehabProgramFeature], {
    nullable: true,
    description: 'Program features and operational characteristics',
  })
  programFeatures(@Parent() program: RehabProgram): RehabProgramFeature[] {
    if (program.programFeatures && program.programFeatures.length > 0) {
      return program.programFeatures;
    }
  }

  @ResolveField(() => [RehabProgramMATType], {
    nullable: true,
    description: 'Medication-assisted treatment types used in this program',
  })
  programMATTypes(@Parent() program: RehabProgram): RehabProgramMATType[] {
    if (program.programMATTypes && program.programMATTypes.length > 0) {
      return program.programMATTypes;
    }
  }

  @ResolveField(() => [RehabProgramSubstance], {
    nullable: true,
    description: 'Substances treated in this program',
  })
  programSubstances(@Parent() program: RehabProgram): RehabProgramSubstance[] {
    if (program.programSubstances && program.programSubstances.length > 0) {
      return program.programSubstances;
    }
  }
}
