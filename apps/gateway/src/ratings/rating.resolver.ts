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
import { ProductSchema } from '../products/schema/product.schema';
import { StockSchema } from '../products/schema/stock.schema';
import { PublicUserSchema } from '@commerce/shared';
import { UserService } from '../users/user.service';
import { UserResolver } from '../users/user.resolver';

@Resolver(() => RatingSchema)
export class RatingResolver {
  constructor(
    private readonly ratingService: RatingService,
    private readonly userService: UserService,
    ) {}
  @Query(returns => RatingSchema)
  showRating(@Args('id') id: string) {
    return this.ratingService.showRating(id);
  }
  @ResolveField(returns => PublicUserSchema)
  async user(@Parent() ratingParent: RatingSchema) {
    return this.userService.me(ratingParent.userId)
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
}
