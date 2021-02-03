import { ProductService } from '../products/product.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';

import { RatingEntity } from './rating.entity';
import { Ratingservice } from './rating.service';
import { ProductEntity } from '../products/product.entity';

@Controller('Ratings')
export class RatingController {
  constructor(private readonly Ratings: Ratingservice) {}

  @MessagePattern('Ratings')
  index(data: any = undefined, arg2, arg3): Promise<RatingEntity[]> {
    return this.Ratings.get(data);
  }

  @MessagePattern('create-rating')
  store(rating): Promise<RatingEntity> {
    return this.Ratings.store(rating);
  }

  @MessagePattern('update-rating')
  update({ ratingId, rating, userId }){
    // const { title, description, status } = rating;
    // return this.Ratings.update(ratingId, rating, userId);
  }

  @MessagePattern('show-rating')
  show(id: string): Promise<RatingEntity> {
    return this.Ratings.show(id);
  }
  @MessagePattern('get-product-by-rating-id')
  getRatingByProductId(id: string): Promise<ProductEntity> {
    return this.Ratings.getProductByRatingId(id);
  }
  @MessagePattern('fetch-ratings-by-ids')
  fetchRatingsByIds(ids: Array<string>) {
    return this.Ratings.fetchRatingsByIds(ids);
  }
  @EventPattern('consume-rating')
  async handleOrderDeleted({
    productId,
    user_id,
  }: {
    productId: string;
    user_id: string;
  }) {
    return this.Ratings.consumeRating(productId, user_id);
  }
  @MessagePattern('delete-rating')
  destroy({ id, user_id }: { id: string; user_id: string }) {
    return this.Ratings.destroy(id, user_id);
  }
}
