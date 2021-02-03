import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

import { config } from '@commerce/shared';
import { redis, redisRatingsKey } from '../utils/redis';
// import { RatingEntity } from "apps/ratings/src";
import { ProductEntity, StockEntity, RatingEntity } from '@commerce/products';
import { CreateRatingInput } from './input/create-rating.input';
import { RatingSchema } from './schema/rating.schema';
import { UpdateRatingInput } from './input/update-rating.input';
@Injectable()
export class RatingService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`,
    },
  })
  private client: ClientProxy;
  showRating(id: string): Promise<RatingSchema> {
    return new Promise((resolve, reject) => {
      RatingEntity;
      this.client.send<RatingSchema>('show-rating', id).subscribe(
        (rating) => resolve(rating),
        (error) => reject(error),
      );
    });
  }
  async getRatingProduct(id: string): Promise<ProductEntity> {
    return new Promise((resolve, reject) => {
      this.client
        .send<ProductEntity>('get-product-by-rating-id', id)
        .subscribe(
          (rating) => resolve(rating),
          (error) => reject(error),
        );
    });
  }
  async getRatingStock(id: string): Promise<StockEntity[]> {
    return new Promise((resolve, reject) => {
      this.client
        .send<StockEntity[]>('show-rating-stock', id)
        .subscribe(
          (stock) => resolve(stock),
          (error) => reject(error),
        );
    });
  }

  createRating(data: CreateRatingInput, id: string): Promise<RatingSchema> {
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<RatingSchema>('create-rating', {
          ...data,
        })
        .subscribe(
          (rating) => {
            redis.del(redisRatingsKey);
            return resolve(rating);
          },
          (error) => reject(error),
        );
    });
  }
  updateRating(
    ratingId: string,
    rating: UpdateRatingInput,
    userId: string,
  ): Promise<RatingEntity> {
    return new Promise((resolve, reject) => {
      this.client
        .send<RatingEntity>('update-rating', { ratingId, rating, userId })
        .subscribe(
          (rating) => {
            redis.del(redisRatingsKey);
            return resolve(rating);
          },
          (error) => reject(error),
        );
    });
  }
  destroyRating(ratingId: string, id: string) {
    return new Promise((resolve, reject) => {
      this.client
        .send<RatingSchema>('delete-rating', {
          id: ratingId,
          user_id: id,
        })
        .subscribe(
          (rating) => {
            redis.del(redisRatingsKey);
            return resolve(rating);
          },
          (error) => reject(error),
        );
    });
  }
}
