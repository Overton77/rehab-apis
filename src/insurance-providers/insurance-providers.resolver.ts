import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InsuranceProvidersService } from './insurance-providers.service';
import {
  CreateInsuranceProviderInput,
  InsuranceProviderGQL,
  UpdateInsuranceProviderInput,
} from './dto';

@Resolver(() => InsuranceProviderGQL)
export class InsuranceProvidersResolver {
  constructor(private service: InsuranceProvidersService) {}

  @Query(() => [InsuranceProviderGQL])
  insuranceProviders(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.service.findMany({ skip, take, search });
  }

  @Query(() => InsuranceProviderGQL, { nullable: true })
  insuranceProvider(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Mutation(() => InsuranceProviderGQL)
  createInsuranceProvider(@Args('data') data: CreateInsuranceProviderInput) {
    return this.service.create(data);
  }

  @Mutation(() => InsuranceProviderGQL)
  updateInsuranceProvider(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateInsuranceProviderInput,
  ) {
    return this.service.update(id, data);
  }

  @Mutation(() => InsuranceProviderGQL)
  deleteInsuranceProvider(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}
