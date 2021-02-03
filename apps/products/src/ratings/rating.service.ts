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

import { RatingEntity, ratingStatus } from './rating.entity';
import { CreateRatingInput } from '@commerce/gateway';
import { ProductEntity } from '../products/product.entity';
import { ProductService } from '../products/product.service';
import { UpdateRatingInput } from '@commerce/gateway';
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
  async store(rating: CreateRatingInput): Promise<any> {
    // rating.product = this.productService.show(rating.product.to)
    // const newRating = new RatingEntity();
    // newRating.title = rating.title;
    // newRating.description = rating.description;
    // // newRating.product = await this.productService.show(rating.product);
    // const variant = await this.variantservice.get({
    //   where:{
    //     id: rating.variantId
    //   },
    //   relations: ["product"]
    // })
    // if(variant.length === 0) throw new RpcException(new NotFoundException());
    // const { product } = variant[0];
    // newRating.variant = variant[0];
    // newRating.product = product;
    // return this.Ratings.save(newRating).then(async s=>{
    //   await this.productService.updateProductQuantity(product.id);
    //   return s;
    // }).catch((error) => {
    //   console.log(error);
      
    //   throw new RpcException(new BadRequestException(error.message));
    // });
  }

  getRatingByVariantId(variantId:string) {
    return this.Ratings.find({
      where: {
        variant: variantId
      }
    });
  }
  async update(
    id: string,
    newRatingData: UpdateRatingInput,
    userId: string,
    ignoreUserValidation = false,
  ){
    // const oldRating = await this.Ratings.findOneOrFail({
    //   where: { id },
    //   relations: ['product'],
    // });
    // if (ignoreUserValidation === true || oldRating.product.user_id === userId) {
    //   await this.Ratings.update(id, newRatingData);
    //   // if there is update on status we need to make sure product quantity is up to date
    //   if (newRatingData.status) {
    //     await this.productService.updateProductQuantity(oldRating.product.id);
    //   }
    //   const newRating = await this.Ratings.findOneOrFail({ id });
    //   return newRating;
    // }
    // throw new RpcException(
    //   new NotFoundException("You cannot update what you don't own..."),
    // );
  }
  async show(id: string): Promise<RatingEntity> {
    return this.Ratings.findOneOrFail({ 
      where:{id},
      relations:["product", "variant"]
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
        status: ratingStatus.AVAILABLE
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
        status: ratingStatus.AVAILABLE,
      },
    });
  }
  async consumeRating(productId: string, user_id: string) {
    let rating;
    try {
      rating = await this.Ratings.findOneOrFail({
        where: {
          product: productId,
          status: ratingStatus.AVAILABLE,
        },
      });
    } catch (error) {
      return new RpcException(
        new NotFoundException('cannot find available rating'),
      );
    }
    rating.status = ratingStatus.CONSUMED;
    this.update(rating.id, rating, user_id);
    return rating;
  }
}
