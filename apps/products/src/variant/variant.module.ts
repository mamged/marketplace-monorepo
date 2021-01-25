import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Variantservice } from './variant.service';
import { VariantEntity } from './variant.entity';
import { VariantController } from './variant.controller';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    forwardRef(() => ProductsModule),
    TypeOrmModule.forFeature([VariantEntity]),
  ],
  providers: [Variantservice],
  controllers: [VariantController],
  exports: [Variantservice],
})
export class VariantsModule {}
