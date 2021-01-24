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

  /**
   * a signle source of truth function to make stock updates
   * @param oldStock the stock item which needs to be updated
   * @param newStock the payload which the stock item will be updated to
   */
  updateProductQuantityIfNeeded(
    oldStock: StockEntity,
    newStock: UpdateStockInput,
  ) {
    if (
      oldStock.status === stockStatus.AVAILABLE &&
      newStock.status !== stockStatus.AVAILABLE
    ) {
      oldStock.product.quantity = 1;
      this.productService.decrementProductsStock([oldStock.product]);
    } else if (
      oldStock.status !== stockStatus.AVAILABLE &&
      newStock.status === stockStatus.AVAILABLE
    ) {
      oldStock.product.quantity = 1;
      this.productService.incrementProductsStock([oldStock.product]);
    }
  }
  async update(
    id: string,
    newStockData: UpdateStockInput,
    userId: string,
    ignoreUserValidation = false,
  ): Promise<StockEntity> {
    const oldStock = await this.Stocks.findOneOrFail({
      where: { id },
      relations: ['product'],
    });
    if (ignoreUserValidation === true || oldStock.product.user_id === userId) {
      await this.Stocks.update(id, newStockData);
      // if there is update on status we need to make sure product quantity is up to date
      if (newStockData.status) {
        this.updateProductQuantityIfNeeded(oldStock, newStockData);
      }
      const newStock = await this.Stocks.findOneOrFail({ id });
      return newStock;
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<StockEntity> {
    return this.Stocks.findOneOrFail({ id });
  }
  async getProductByStockId(id: string): Promise<ProductEntity> {
    const stock = await this.Stocks.findOneOrFail({
      where: { id },
      relations: ['product'],
    });
    return stock.product;
  }
  async destroy(id: string, user_id: string): Promise<StockEntity> {
    try {
      const stock = await this.update(
        id,
        { status: stockStatus.DELETED },
        user_id,
      );
      return stock;
    } catch (error) {
      throw new RpcException(
        new NotFoundException("You cannot update what you don't own..."),
      );
    }
  }
  async getStockByProductId(id: string) {
    return this.Stocks.find({
      where: {
        product: id,
        status: stockStatus.AVAILABLE,
      },
    });
  }
  async consumeStock(productId: string, user_id: string) {
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
    this.update(stock.id, stock, user_id);
    return stock;
  }
  async incrementStocksStock(Stocks) {
    Stocks.forEach((stock) => {
      this.Stocks.increment({ id: stock.id }, 'quantity', stock.quantity);
    });
  }
}
