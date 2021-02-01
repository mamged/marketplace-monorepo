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
import { Variantservice } from '../variant/variant.service';

@Injectable()
export class Stockservice {
  constructor(
    @InjectRepository(StockEntity)
    private readonly Stocks: Repository<StockEntity>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
    @Inject(forwardRef(() => Variantservice))
    private variantservice: Variantservice,
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
    // newStock.product = await this.productService.show(stock.product);
    const variant = await this.variantservice.get({
      where:{
        id: stock.variantId
      },
      relations: ["product"]
    })
    if(variant.length === 0) throw new RpcException(new NotFoundException());
    const { product } = variant[0];
    newStock.variant = variant[0];
    const  p = new ProductEntity();
    p.id = product.id,
    p.user_id = product.user_id;
    newStock.product = p;
    return this.Stocks.save(newStock).then(async s=>{
      await this.productService.updateProductQuantity(product.id);
      return s;
    }).catch((error) => {
      console.log(error);
      
      throw new RpcException(new BadRequestException(error.message));
    });
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
        await this.productService.updateProductQuantity(oldStock.product.id);
      }
      const newStock = await this.Stocks.findOneOrFail({ id });
      return newStock;
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<StockEntity> {
    this.countAvailableProductStock(id);
    return this.Stocks.findOneOrFail({ 
      where:{id},
      relations:["product", "variant"]
    });
  }
  async countAvailableProductStock(product: string): Promise<number> {
    return this.Stocks.count({
      where:{
        product,
        status: stockStatus.AVAILABLE
      }
    });
  }
  async getProductByStockId(id: string): Promise<any> {
    const stock = await this.Stocks.findOneOrFail({
      where: { id },
      relations: ['product'],
    });
    return stock;
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
}
