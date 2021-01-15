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
import { CategoryRelationsInput, CreateCategoryInput } from './create-category.validation';
import { SellerGuard } from '../middlewares/seller.guard';
import { CategoryEntity, ProductEntity } from '@commerce/products';
import { CategoryService } from './category.service';

@Resolver(of => CategoryEntity)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(returns => [CategoryEntity])
  async categories(): Promise<CategoryEntity[]> {
    const f = await this.categoryService.get();
    console.log('FF!!!FFF>>>', f)
    return f;
  }
  @ResolveField(returns => CategoryEntity)
  async parent(@Parent() category: CategoryRelationsInput) {
    const { parent: parentId } = category;
    console.log('parentId',parentId);
    
    if(!parentId)
        return;
    
    console.log('parent field resolver');
    return this.categoryService.show(parentId);
  }
  @ResolveField(returns => [CategoryEntity])
  async children(@Parent() category: CreateCategoryInput) {
    
    const { children: childrenIds } = category;
    console.log('childrenIds',childrenIds);
    
    if(!childrenIds)
        return null;
    if(typeof(childrenIds[0]) === 'string'){
        // console.log('children field resolver');
        return this.categoryService.fetchCategoriesByIds(childrenIds);
    } else if(typeof(childrenIds[0]) === 'object'){
        return childrenIds
    }
  }
  @Query(returns => CategoryEntity)
  async showCategory(@Args('id') id: string) {
    return this.categoryService.show(id);
  }

  @Mutation(returns => CategoryEntity)

  async createCategory(@Args('data') data: CreateCategoryInput) {
    // console.log('data>$', data, '$<');
    return this.categoryService.store(data);
  }
  @Mutation(returns => CategoryEntity)
  async updateCategory(
    @Args('data') data: CreateCategoryInput,
    @Args('id') id: number,
  ) {
    return this.categoryService.update(data, id);
  }
  @Mutation(returns => CategoryEntity)
  async deleteCategory(@Context('user') user: any, @Args('id') id: string) {
    return this.categoryService.destroy(id, user.id);
  }
}
