import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Stockservice } from './stock.service';
import { StockEntity } from './stock.entity';
import { StockController } from './stock.controller';
import { ProductsModule } from '../index';
@Module({
  imports: [forwardRef(() => ProductsModule), TypeOrmModule.forFeature([StockEntity]),],
  providers: [Stockservice],
  controllers: [StockController],
  exports: [Stockservice]
})
export class StocksModule {}
