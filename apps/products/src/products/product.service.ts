import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { ProductEntity } from './product.entity';
import { Product, ProductInput } from 'src/schemas/graphql';
import { StockEntity, stockStatus } from '../stocks/stock.entity';
import { Stockservice } from '../stocks/stock.service';
import { VariantEntity } from '../variant/variant.entity';
import { CreateProductInput, UpdateProductInput } from '@commerce/gateway';
import { RatingEntity } from '../ratings/rating.entity';
import { isUrlArray } from '@commerce/shared';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
    @Inject(forwardRef(() => Stockservice))
    private stockService: Stockservice,
  ) {}
  get(data: any = undefined): Promise<ProductEntity[]> {
    return this.products.find(data);
  }
  async getProductStock(id: string): Promise<any> {
    try {
      // const stock = await this.stock.getStockByProductId(id);
      // return stock;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
  fetchProductsByIds(ids: Array<string>) {
    return this.products
      .createQueryBuilder('products')
      .where(`products.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(product: CreateProductInput): Promise<any> {
    product.hasOwnProperty('image') && isUrlArray(product.image);

    return this.products.save(product).catch((error) => {      
      throw new RpcException(new BadRequestException(error.message));
    });
  }
  async update(
    id: string,
    data: UpdateProductInput,
    user_id?: string,
  ): Promise<ProductEntity> {
    data.hasOwnProperty('image') && isUrlArray(data.image);
    const product = await this.products.findOneOrFail({ id }).catch(()=>{
      throw new RpcException(new NotFoundException());
    });
    if (product.user_id !== user_id) throw new RpcException(new UnauthorizedException());
    await this.products.update({ id }, data);
    return this.products.findOneOrFail({ id });
  }
  async updateProductQuantity(productId:string) {
    const productStock = await this.stockService.countAvailableProductStock(productId);
    return this.products.update(productId,{quantity: productStock});
  }
  async getVariants(productId: string): Promise<VariantEntity[]>{
    const product = await this.products.findOneOrFail({
      where: { id: productId},
      relations: ["variants"]
    }).catch(()=>{
      throw new RpcException(
        new NotFoundException("Cannot find product..."),
      );
    })
    return product.variants.filter(variant=> variant.deletedAt === null);
  }
  async getRatings(productId: string): Promise<RatingEntity[]>{
    const product = await this.products.findOneOrFail({
      where: { id: productId},
      relations: ["ratings"]
    }).catch(()=>{
      throw new RpcException(
        new NotFoundException("Cannot find product..."),
      );
    });
    return product.ratings;
  }
  async show(id: string): Promise<ProductEntity> {
    console.log('id', id);
    
    const a = await this.products.findOneOrFail({ id });
    console.log('aaaaa',a);
    
    return a;
  }
  async destroy(id: string, user_id: string): Promise<ProductEntity> {
    return this.products.findOne({
      where: {
        id: '6189dfd1-b699-4479-938b-90c10493b1cb',
      },
      relations: ['stock'],
    });
    // const product = await this.products.findOneOrFail({ id });
    // if (product.user_id === user_id) {
    //     await this.products.delete({ id });
    //     return product;
    // }
    // throw new RpcException(
    //     new NotFoundException("You cannot update what you don't own...")
    // );
  }
  async decrementProductsStock(products: ProductEntity[]) {
    products.forEach(async (product) => {
      this.updateProductQuantity(product.id);
    });
  }
  async incrementProductsStock(products: ProductEntity[]) {
    products.forEach((product) => {
      this.updateProductQuantity(product.id);
    });
  }
}
