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
  store(@Payload() data): Promise<RatingEntity> {
    const {userId, ...rating} = data;
    return this.Ratings.store(rating, userId);
  }

  @MessagePattern('show-rating')
  rating(id: string): Promise<RatingEntity> {
    return this.Ratings.show(id);
  }
}
