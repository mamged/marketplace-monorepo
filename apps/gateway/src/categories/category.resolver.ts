import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { UserDTO, config, CategoryDTO } from "@commerce/shared";
import {
    Query,
    Resolver,
    Context,
    Mutation,
    Args,
    ResolveField,
    Parent
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { AuthGuard } from "../middlewares/auth.guard";
import { CreateCategory } from "./create-category.validation";
import { SellerGuard } from "../middlewares/seller.guard";
import { CategoryEntity, ProductEntity } from "@commerce/products";
import { CategoryService } from "./category.service";

@Resolver(()=> CreateCategory)
export class CategoryResolver {
    constructor(
        private readonly categoryService: CategoryService
    ) {}
    
    @Query(returns=> [CategoryEntity])
    categories(): Promise<CategoryEntity[]> {
        return this.categoryService.get()
    }
    @Query(returns=> CategoryEntity)
    async showCategory(@Args("id") id: string) {
        return this.categoryService.show(id);
    }

    @Mutation(returns=> CategoryEntity)
    @UseGuards(new AuthGuard())
    async createCategory(
        @Args("data") data: CreateCategory
    ) {
        console.log('data>$',data, '$<');
        try {
            this.categoryService.store(data)
            .then(_=> console.log('then#'))
            .catch(_=> console.log('catch###'))
            .finally(()=> {console.log('finally###')});
        } catch (error) {
            console.log('cccc!!!!!!');
            
        }
        return this.categoryService.store(data);
    }
    @Mutation(returns=> CategoryEntity)
    @UseGuards(new AuthGuard(), new SellerGuard())
    async updateCategory(
        @Args("data") data: CreateCategory,
        @Args("id") id: number
    ) {
        return this.categoryService.update(data, id);
    }
    @Mutation(returns=> undefined)
    @UseGuards(new AuthGuard(), new SellerGuard())
    async deleteProduct(@Context("user") user: any, @Args("id") id: string) {
        return this.categoryService.destroy(id, user.id);
    }
}
