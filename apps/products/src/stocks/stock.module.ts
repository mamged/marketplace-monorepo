import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Stockservice } from './stock.service';
import { StockEntity } from './stock.entity';
import { StockController } from './stock.controller';
import { VariantsModule } from '../variant/variant.module';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    forwardRef(() => ProductsModule),
    forwardRef(() => VariantsModule),
    TypeOrmModule.forFeature([StockEntity]),
  ],
  providers: [Stockservice],
  controllers: [StockController],
  exports: [Stockservice],
})
export class StocksModule {}
