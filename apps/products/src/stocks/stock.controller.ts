import { CreateStockInput, UpdateStockInput } from "@commerce/gateway";
import { ProductService } from "../products/product.service";
import { Controller } from "@nestjs/common";
import { MessagePattern, EventPattern } from "@nestjs/microservices";

import { StockEntity } from "./stock.entity";
import { Stockservice } from "./stock.service";

@Controller("Stocks")
export class StockController {
    constructor(private readonly Stocks: Stockservice) {}

    @MessagePattern("Stocks")
    index(data: any = undefined, arg2, arg3): Promise<StockEntity[]> {
        return this.Stocks.get(data);
    }

    @MessagePattern("create-stock")
    store(stock: CreateStockInput): Promise<StockEntity> {
        return this.Stocks.store(stock);
    }

    @MessagePattern("update-stock")
    update(stockId, stock: UpdateStockInput, userId): Promise<StockEntity> {
        return this.Stocks.update(
            stockId,
            stock,
            userId
        );
    }

    @MessagePattern("show-stock")
    show(id: string): Promise<StockEntity> {
        return this.Stocks.show(id);
    }
    @MessagePattern("fetch-Stocks-by-ids")
    fetchStocksByIds(ids: Array<string>) {
        return this.Stocks.fetchStocksByIds(ids);
    }
    @EventPattern("order_deleted")
    async handleOrderDeleted(
        Stocks: Array<{ id: string; quantity: number }>
    ) {
        this.Stocks.incrementStocksStock(Stocks);
    }
    @EventPattern("order_created")
    async handleOrderCreated(
        Stocks: Array<{ id: string; quantity: number }>
    ) {
        this.Stocks.decrementStocksStock(Stocks);
    }

    @MessagePattern("delete-stock")
    destroy({ id, user_id }: { id: string; user_id: string }) {
        return this.Stocks.destroy(id, user_id);
    }
}
