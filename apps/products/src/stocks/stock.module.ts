import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Stockservice } from "./stock.service";
import { StockEntity } from "./stock.entity";
import { StockController } from "./stock.controller";
import { ProductService } from "@commerce/gateway/products/product.service";
@Module({
    imports: [TypeOrmModule.forFeature([StockEntity])],
    providers: [Stockservice, ProductService],
    controllers: [StockController]
})
export class StocksModule {}
