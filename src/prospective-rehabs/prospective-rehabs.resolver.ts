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
  prospectiveRehabs(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('cursorId', { type: () => Int, nullable: true }) cursorId?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.service.findMany({ skip, take, cursorId, search });
  }

  @Query(() => ProspectiveRehab, { nullable: true })
  prospectiveRehab(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Mutation(() => ProspectiveRehab)
  createProspectiveRehab(@Args('data') data: CreateProspectiveRehabInput) {
    return this.service.create(data);
  }

  @Mutation(() => [ProspectiveRehab])
  createManyProspectiveRehabs(
    @Args({ name: 'data', type: () => [CreateProspectiveRehabInput] })
    data: CreateProspectiveRehabInput[],
  ) {
    return this.service.createMany(data);
  }

  @Mutation(() => ProspectiveRehab)
  updateProspectiveRehab(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateProspectiveRehabInput,
  ) {
    return this.service.update(id, data);
  }

  @Mutation(() => ProspectiveRehab)
  deleteProspectiveRehab(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}
