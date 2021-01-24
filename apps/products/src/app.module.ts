import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/category.module';
import { StocksModule } from './stocks/stock.module';
import { VariantsModule } from './variant/variant.module'
const ormconfig = require('../ormconfig.json');

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig[0]),
    ProductsModule,
    VariantsModule,
    StocksModule,
    CategoriesModule,
  ],
})
export class AppModule {}
