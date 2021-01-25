import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { Stockservice } from '../stocks/stock.service';
import { StocksModule } from '../stocks/stock.module';
import { VariantsModule } from '../variant/variant.module';
@Module({
  imports: [
    forwardRef(() => VariantsModule),
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductsModule {}
