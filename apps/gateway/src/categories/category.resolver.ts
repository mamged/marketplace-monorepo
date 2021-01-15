import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { UserDTO, config, CategoryDTO } from '@commerce/shared';
import {
  Query,
  Resolver,
  Context,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../middlewares/auth.guard';
import {
  CategoryRelationsInput,
  CreateCategoryInput,
} from './create-category.validation';
import { SellerGuard } from '../middlewares/seller.guard';
import { CategoryEntity, ProductEntity } from '@commerce/products';
import { CategoryService } from './category.service';

@Resolver((of) => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query((returns) => [CategoryEntity])
  async categories(): Promise<CategoryEntity[]> {
    return await this.categoryService.get();
  }
  @ResolveField((returns) => CategoryEntity)
  async parent(@Parent() category: CategoryRelationsInput) {
    const { parent: parentId } = category;
    if (!parentId) return;
    switch (typeof parentId) {
      case 'string':
        return this.categoryService.show(parentId);
      case 'object':
        return parentId;
      default:
        return;
    }
  }
  @ResolveField((returns) => [CategoryEntity])
  children(@Parent() category: CreateCategoryInput) {
    const { children: childrenIds } = category;
    if (!childrenIds) return;
    switch (typeof childrenIds[0]) {
      case 'string':
        return this.categoryService.fetchCategoriesByIds(childrenIds);
      case 'object':
        return childrenIds;
      default:
        return;
    }
  }
  @Query((returns) => CategoryEntity)
  showCategory(@Args('id') id: string) {
    return this.categoryService.show(id);
  }

  @Mutation((returns) => CategoryEntity)
  createCategory(@Args('data') data: CreateCategoryInput) {
    return this.categoryService.store(data);
  }
  @Mutation((returns) => CategoryEntity)
  updateCategory(
    @Args('data') data: CreateCategoryInput,
    @Args('id') id: number,
  ) {
    return this.categoryService.update(data, id);
  }
  @Mutation((returns) => CategoryEntity)
  deleteCategory(@Context('user') user: any, @Args('id') id: string) {
    return this.categoryService.destroy(id, user.id);
  }
}
