import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { CategoryController } from './category.controller';
@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoriesModule {}
