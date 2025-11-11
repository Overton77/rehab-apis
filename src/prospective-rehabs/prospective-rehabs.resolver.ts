import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProspectiveRehabsService } from './prospective-rehabs.service';
import {
  CreateProspectiveRehabInput,
  ProspectiveRehab,
  UpdateProspectiveRehabInput,
} from './dto';

@Resolver(() => ProspectiveRehab)
export class ProspectiveRehabsResolver {
  constructor(private service: ProspectiveRehabsService) {}

  @Query(() => [ProspectiveRehab])
  rehabs(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('cursorId', { type: () => Int, nullable: true }) cursorId?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.service.findMany({ skip, take, cursorId, search });
  }

  @Query(() => ProspectiveRehab, { nullable: true })
  rehab(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Mutation(() => ProspectiveRehab)
  createRehab(@Args('data') data: CreateProspectiveRehabInput) {
    return this.service.create(data);
  }

  @Mutation(() => [ProspectiveRehab])
  createManyRehabs(
    @Args({ name: 'data', type: () => [CreateProspectiveRehabInput] })
    data: CreateProspectiveRehabInput[],
  ) {
    return this.service.createMany(data);
  }

  @Mutation(() => ProspectiveRehab)
  updateRehab(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateProspectiveRehabInput,
  ) {
    return this.service.update(id, data);
  }

  @Mutation(() => ProspectiveRehab)
  deleteRehab(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}
