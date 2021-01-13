import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { CategoryDTO, UserDTO, config } from "@commerce/shared";
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
import { CategoryService } from "./product.service";
import { SellerGuard } from "../middlewares/seller.guard";
import { UserDataLoader } from "../loaders/user.loader";
import { UserEntity } from "@commerce/users";
import { CategoryEntity } from "@commerce/products";
import { Roles } from "../decorators/roles.decorator";

@Resolver(()=> CreateCategory)
export class CategoryResolver {
    constructor(
        private readonly productService: CategoryService,
        private readonly usersDataLoader: UserDataLoader
    ) {}
    
    @ResolveField(returns=> UserEntity)
    async user(@Parent() product: CategoryDTO): Promise<UserDTO> {
        return this.usersDataLoader.load(product.user.id.toString());
    }
    @Query(returns=> [CategoryEntity])
    products(): Promise<CategoryDTO[]> {
        return this.productService.get();
    }
    @Query(returns=> CategoryEntity)
    async showCategory(@Args("id") id: string) {
        return this.productService.show(id);
    }

    @Mutation(returns=> CategoryEntity)
    @Roles("admin")
    @UseGuards(new AuthGuard(), new SellerGuard())
    async createCategory(
        @Args("data") data: CreateCategory,
        @Context("user") user: any
    ) {
        return this.productService.store(data, user.id);
    }
    @Mutation(returns=> CategoryEntity)
    @UseGuards(new AuthGuard(), new SellerGuard())
    async updateCategory(
        @Args("data") data: CreateCategory,
        @Context("user") user: any,
        @Args("id") id: string
    ) {
        return this.productService.update(data, id, user.id);
    }
    @Mutation(returns=> undefined)
    @UseGuards(new AuthGuard(), new SellerGuard())
    async deleteCategory(@Context("user") user: any, @Args("id") id: string) {
        return this.productService.destroy(id, user.id);
    }
}
