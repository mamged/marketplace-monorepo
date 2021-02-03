import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getRepository, QueryFailedError, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { RatingEntity } from './rating.entity';
import { CreateRatingInput } from '@commerce/gateway';
import { ProductEntity } from '../products/product.entity';
import { ProductService } from '../products/product.service';
import { Variantservice } from '../variant/variant.service';

@Injectable()
export class Ratingservice {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly Ratings: Repository<RatingEntity>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => Variantservice))
    private variantservice: Variantservice,
  ) {}
  get(data: any = undefined): Promise<RatingEntity[]> {
    return this.Ratings.find(data);
  }
  async store(rating: CreateRatingInput, userId: string): Promise<any> {
    const product = this.productService.show(rating.productId).catch(()=>{
      throw new RpcException(
        new NotFoundException("product not found"),
      );
    });
    const newRating = new RatingEntity();
    newRating.value = rating.value;
    newRating.userId = userId;
    newRating.product = await this.productService.show(rating.productId);
    return this.Ratings.save(newRating).catch((error) => {
      throw new RpcException(new BadRequestException(error.message));
    });
  }

  async show(id: string): Promise<RatingEntity> {
    return this.Ratings.findOneOrFail({ 
      where:{id},
      relations:["product"]
    }).catch(()=>{
      throw new RpcException(
        new NotFoundException("You cannot update what you don't own..."),
      );
    });
  }
}
