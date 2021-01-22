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

import { StockEntity, stockStatus } from './stock.entity';
import { CreateStockInput } from '@commerce/gateway/products/input/create-stock.input';
import { ProductEntity } from '../products/product.entity';
import { ProductService } from '../products/product.service';
import { UpdateStockInput } from '@commerce/gateway';

@Injectable()
export class Stockservice {
  constructor(
    @InjectRepository(StockEntity)
    private readonly Stocks: Repository<StockEntity>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}
  get(data: any = undefined): Promise<StockEntity[]> {
    return this.Stocks.find(data);
  }
  fetchStocksByIds(ids: Array<string>) {
    return this.Stocks.createQueryBuilder('Stocks')
      .where(`Stocks.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(stock: CreateStockInput): Promise<any> {
    // stock.product = this.productService.show(stock.product.to)
    const newStock = new StockEntity();
    newStock.title = stock.title;
    newStock.description = stock.description;
    newStock.product = await this.productService.show(stock.product);
    const product = new ProductEntity();
    product.id = stock.product;
    product.quantity = 1;
    this.productService.incrementProductsStock([product]);
    return this.Stocks.save(newStock).catch((error) => {
      throw new RpcException(new BadRequestException(error.message));
    });
  }
  async update(
    id: string,
    data: UpdateStockInput,
    userId: string,
  ): Promise<StockEntity> {
    const stock = await this.Stocks.findOneOrFail({ id });

    if (stock.product.user_id === userId) {
      const updated = { ...data };

      await this.Stocks.update(id, updated);
      return this.Stocks.findOneOrFail({ id });
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<StockEntity> {
    return this.Stocks.findOneOrFail({ id });
  }
  async getProductByStockId(id: string): Promise<StockEntity> {
    return this.Stocks.findOneOrFail({ where: { id }, relations: ['product'] });
  }
  async destroy(id: string, user_id: string): Promise<StockEntity> {
    const stock = await this.Stocks.findOneOrFail({ id });
    // if (stock.user_id === user_id) {
    await this.Stocks.delete({ id });
    return stock;
    // }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async getStockByProductId(id: string) {
    return this.Stocks.find({
      where: {
        product: id,
        status: stockStatus.AVAILABLE,
      },
    });
  }
  async consumeStock(productId: string) {
    let stock;
    try {
      stock = await this.Stocks.findOneOrFail({
        where: {
          product: productId,
          status: stockStatus.AVAILABLE,
        },
      });
    } catch (error) {
      return new RpcException(
        new NotFoundException('cannot find available stock'),
      );
    }
    stock.status = stockStatus.CONSUMED;
    stock.save();
    const product = new ProductEntity();
    product.id = productId;
    product.quantity = 1;
    this.productService.decrementProductsStock([product]);
    return stock;
  }
  async incrementStocksStock(Stocks) {
    Stocks.forEach((stock) => {
      this.Stocks.increment({ id: stock.id }, 'quantity', stock.quantity);
    });
  }
}
