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
  fetchRatingsByIds(ids: Array<string>) {
    return this.Ratings.createQueryBuilder('Ratings')
      .where(`Ratings.id IN (:...ids)`, { ids })
      .getMany();
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

  getRatingByVariantId(variantId:string) {
    return this.Ratings.find({
      where: {
        variant: variantId
      }
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
  async countAvailableProductRating(product: string): Promise<number> {
    return this.Ratings.count({
      where:{
        product,
        // status: ratingStatus.AVAILABLE
      }
    });
  }
  async getProductByRatingId(id: string): Promise<any> {
    const rating = await this.Ratings.findOneOrFail({
      where: { id },
      relations: ['product'],
    });
    return rating;
  }
  async destroy(id: string, user_id: string){
    // try {
    //   const rating = await this.update(
    //     id,
    //     { status: ratingStatus.DELETED },
    //     user_id,
    //   );
    //   return rating;
    // } catch (error) {
    //   throw new RpcException(
    //     new NotFoundException("You cannot update what you don't own..."),
    //   );
    // }
  }
  async getRatingByProductId(id: string) {
    return this.Ratings.find({
      where: {
        product: id,
        // status: ratingStatus.AVAILABLE,
      },
    });
  }
}
