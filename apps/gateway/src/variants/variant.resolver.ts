import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import {  UserDTO, config } from '@commerce/shared';
import {
  Query,
  Resolver,
  Context,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../middlewares/auth.guard';
import { VariantService } from './variant.service';
import { SellerGuard } from '../middlewares/seller.guard';
import { UserDataLoader } from '../loaders/user.loader';
import { Roles } from '../decorators/roles.decorator';
import { UserSchema } from '../users/schema/me.schema';
import { VariantSchema } from './schema/variant.schema';
import { CreateVariantInput } from './input/create-variant.input';
import { UpdateVariantInput } from './input/update-variant.input';

@Resolver(() => VariantSchema)
export class VariantResolver {
  constructor(private readonly variantService: VariantService) {}
  @Query((returns) => VariantSchema)
  showVariant(@Args('id') id: string) {
    return this.variantService.showVariant(id);
  }

  @Mutation((returns) => VariantSchema)
  @Roles('admin')
  @UseGuards(new AuthGuard(), new SellerGuard())
  async createVariant(
    @Args('data') data: CreateVariantInput,
    @Context('user') user: any,
  ) {
    console.log('create variant', data);

    const p = await this.variantService.createVariant(data, user.id);
    return p;
  }

  @Mutation((returns) => VariantSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  updateVariant(
    @Args('data') data: UpdateVariantInput,
    @Context('user') user: any,
    @Args('id') variantId: string,
  ) {
    return this.variantService.updateVariant(variantId, data, user.id);
  }
  @Mutation((returns) => VariantSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  consumeVariant(
    @Context('user') user: any,
    @Args('variantId') variantId: string,
  ) {
    return this.variantService.consumeVariant(variantId, user.id);
  }
  @Mutation((returns) => VariantSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  async deleteVariant(@Context('user') user: any, @Args('id') id: string) {
    return this.variantService.destroyVariant(id, user.id);
  }
}
