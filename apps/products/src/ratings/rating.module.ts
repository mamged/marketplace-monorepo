import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { Ratingservice } from './rating.service';
import { RatingEntity } from './rating.entity';
import { RatingController } from './rating.controller';
import { VariantsModule } from '../variant/variant.module';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    forwardRef(() => ProductsModule),
    forwardRef(() => VariantsModule),
    TypeOrmModule.forFeature([RatingEntity]),
  ],
  providers: [Ratingservice],
  controllers: [RatingController],
  exports: [Ratingservice],
})
export class RatingsModule {}
