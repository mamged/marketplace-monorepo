import { CreateStockInput, UpdateStockInput } from '@commerce/gateway';
import { ProductService } from '../products/product.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';

import { StockEntity } from './stock.entity';
import { Stockservice } from './stock.service';

@Controller('Stocks')
export class StockController {
  constructor(private readonly Stocks: Stockservice) {}

  @MessagePattern('Stocks')
  index(data: any = undefined, arg2, arg3): Promise<StockEntity[]> {
    return this.Stocks.get(data);
  }

  @MessagePattern('create-stock')
  store(stock): Promise<StockEntity> {
    return this.Stocks.store(stock);
  }

  @MessagePattern('update-stock')
  update({ stockId, stock, userId }): Promise<StockEntity> {
    const { title, description, status }: UpdateStockInput = stock;
    return this.Stocks.update(stockId, stock, userId);
  }

  @MessagePattern('show-stock')
  show(id: string): Promise<StockEntity> {
    return this.Stocks.show(id);
  }
  @MessagePattern('get-product-by-stock-id')
  getStockByProductId(id: string): Promise<StockEntity> {
    return this.Stocks.getProductByStockId(id);
  }
  @MessagePattern('fetch-stocks-by-ids')
  fetchStocksByIds(ids: Array<string>) {
    return this.Stocks.fetchStocksByIds(ids);
  }
  @EventPattern('consume-stock')
  async handleOrderDeleted({ productId, user_id }: { productId: string; user_id: string }) {
    return this.Stocks.consumeStock(productId, user_id);
  }
  @MessagePattern('delete-stock')
  destroy({ id, user_id }: { id: string; user_id: string }) {
    return this.Stocks.destroy(id, user_id);
  }
}
