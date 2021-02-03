import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { UserDTO, config } from '@commerce/shared';
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
import { RatingService } from './rating.service';
import { SellerGuard } from '../middlewares/seller.guard';
import { UserDataLoader } from '../loaders/user.loader';
import { Roles } from '../decorators/roles.decorator';
import { UserSchema } from '../users/schema/me.schema';
import { RatingSchema } from './schema/rating.schema';
import { CreateRatingInput } from './input/create-rating.input';
import { UpdateRatingInput } from './input/update-rating.input';
import { ProductSchema } from '../products/schema/product.schema';
import { StockSchema } from '../products/schema/stock.schema';

@Resolver(() => RatingSchema)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}
  @Query(returns => RatingSchema)
  showRating(@Args('id') id: string) {
    return this.ratingService.showRating(id);
  }

  @ResolveField(returns => ProductSchema)
  async product(@Parent() ratingParent: RatingSchema) {
    return this.ratingService.getRatingProduct(ratingParent.id);
  }
  @ResolveField(returns => [StockSchema])
  async stock(@Parent() ratingParent: RatingSchema) {
    return this.ratingService.getRatingStock(ratingParent.id);
  }

  @Mutation(returns => RatingSchema)
  @Roles('admin')
  @UseGuards(new AuthGuard(), new SellerGuard())
  createRating(
    @Args('data') data: CreateRatingInput,
    @Context('user') user: any,
  ) {
    return this.ratingService.createRating(data, user.id);
  }

  @Mutation(returns => RatingSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  updateRating(
    @Args('data') data: UpdateRatingInput,
    @Context('user') user: any,
    @Args('id') ratingId: string,
  ) {
    return this.ratingService.updateRating(ratingId, data, user.id);
  }
  @Mutation(returns => RatingSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  async deleteRating(@Context('user') user: any, @Args('id') id: string) {
    return this.ratingService.destroyRating(id, user.id);
  }
}
