import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { ProductEntity } from './product.entity';
import { Product, ProductInput } from 'src/schemas/graphql';
import { StockEntity } from '../stocks/stock.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
  ) {}
  get(data: any = undefined): Promise<ProductEntity[]> {
    return this.products.find(data);
  }
  getStock(data: any): Promise<ProductEntity[]> {
    return this.products.find({
      where: {
        id: '6189dfd1-b699-4479-938b-90c10493b1cb',
      },
      relations: ['stock'],
    });
  }
  async getProductStock(id: string): Promise<StockEntity[]> {
    try {
      const product = await this.products.findOneOrFail({
        where: {
          id,
        },
        relations: ['stock'],
      });
      return product.stock;
    } catch (error) {
      throw new NotFoundException(`Can't find product with ID ${id}`);
    }
  }
  fetchProductsByIds(ids: Array<string>) {
    return this.products
      .createQueryBuilder('products')
      .where(`products.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(product: ProductInput): Promise<any> {
    return this.products.save(product).catch((error) => {
      throw new RpcException(new BadRequestException(error.message));
    });
  }
  async update(id: string, data: any, user_id: string): Promise<ProductEntity> {
    const product = await this.products.findOneOrFail({ id });
    if (product.user_id === user_id) {
      await this.products.update({ id }, data);
      return this.products.findOneOrFail({ id });
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<ProductEntity> {
    return this.products.findOneOrFail({ id });
  }
  async destroy2(id: string, user_id: string): Promise<ProductEntity> {
    return this.products.findOne({
      where: {
        id: '6189dfd1-b699-4479-938b-90c10493b1cb',
      },
      relations: ['stock'],
    });
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
  async decrementProductsStock(products) {
    products.forEach((product) => {
      this.products.decrement({ id: product.id }, 'quantity', product.quantity);
    });
  }
  async incrementProductsStock(products) {
    products.forEach((product) => {
      this.products.increment({ id: product.id }, 'quantity', product.quantity);
    });
  }
}
