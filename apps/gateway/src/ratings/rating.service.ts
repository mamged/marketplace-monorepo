import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

import { config } from '@commerce/shared';
import { redis, redisRatingsKey } from '../utils/redis';
// import { RatingEntity } from "apps/ratings/src";
import { ProductEntity, StockEntity, RatingEntity } from '@commerce/products';
import { CreateRatingInput } from './input/create-rating.input';
import { RatingSchema } from './schema/rating.schema';
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
  createRating(data: CreateRatingInput, userId: string): Promise<RatingSchema> {
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<RatingSchema>('create-rating', {
          ...data,
          userId
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
