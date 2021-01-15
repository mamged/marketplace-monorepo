import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { ProductDTO, UserDTO, config } from "@commerce/shared";
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
import { ProductService } from "./product.service";
import { SellerGuard } from "../middlewares/seller.guard";
import { UserDataLoader } from "../loaders/user.loader";
import { ProductEntity } from "@commerce/products";
import { Roles } from "../decorators/roles.decorator";
import { UserSchema } from "../users/schema/me.schema";
import { CreateProductInput } from "./input/create-product.input";
import { ProductSchema } from "./schema/product.schema";

@Resolver(()=> ProductSchema)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly usersDataLoader: UserDataLoader
    ) {}
    
    @ResolveField(returns=> UserSchema)
    user(@Parent() product: ProductSchema): Promise<UserSchema> {
        return this.usersDataLoader.load(product.user_id);
    }
    @Query(returns=> [ProductSchema])
    products(): Promise<ProductEntity[]> {
        return this.productService.get();
    }
    @Query(returns=> ProductSchema)
    showProduct(@Args("id") id: string) {
        return this.productService.show(id);
    }

    @Mutation(returns=> ProductSchema)
    @Roles("admin")
    @UseGuards(new AuthGuard(), new SellerGuard())
    async createProduct(
        @Args("data") data: CreateProductInput,
        @Context("user") user: any
    ) {
        console.log('rrrr',data);
        
        const p = await this.productService.store(data, user.id);;
        console.log('pp:',p);
        p.created_at = new Date(p.created_at);
        return p;

    }
    @Mutation(returns=> ProductEntity)
    @UseGuards(new AuthGuard(), new SellerGuard())
    updateProduct(
        @Args("data") data: CreateProductInput,
        @Context("user") user: any,
        @Args("id") id: string
    ) {
        return this.productService.update(data, id, user.id);
    }
    @Mutation(returns=> ProductEntity)
    @UseGuards(new AuthGuard(), new SellerGuard())
    async deleteProduct(@Context("user") user: any, @Args("id") id: string) {
        return this.productService.destroy(id, user.id);
    }
}
