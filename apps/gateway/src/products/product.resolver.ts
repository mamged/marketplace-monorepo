import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ProductDTO, UserDTO, config } from '@commerce/shared';
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
import { ProductService } from './product.service';
import { SellerGuard } from '../middlewares/seller.guard';
import { UserDataLoader } from '../loaders/user.loader';
import { ProductEntity, StockEntity } from '@commerce/products';
import { Roles } from '../decorators/roles.decorator';
import { UserSchema } from '../users/schema/me.schema';
import { CreateProductInput } from './input/create-product.input';
import { ProductSchema } from './schema/product.schema';
import { StockSchema } from './schema/stock.schema';
import { CreateStockInput } from './input/create-stock.input';
import { UpdateStockInput } from './input/update-stock.input';
import { VariantSchema } from '../variants/schema/variant.schema';

@Resolver(() => ProductSchema)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly usersDataLoader: UserDataLoader,
  ) {}

  @ResolveField((returns) => UserSchema)
  user(@Parent() product: ProductSchema): Promise<UserSchema> {
    return this.usersDataLoader.load(product.user_id);
  }
  @ResolveField((returns) => [VariantSchema])
  async variant(@Parent() product: ProductSchema): Promise<VariantSchema[]> {
    return this.productService.getProductVariants(product.id);
  }
  @Query((returns) => [ProductSchema])
  products(): Promise<ProductEntity[]> {
    return this.productService.get();
  }
  @Query((returns) => ProductSchema)
  showProduct(@Args('id') id: string) {
    return this.productService.show(id);
  }
  @Query((returns) => [StockSchema])
  getProductStock(@Args('id') id: string) {
    return this.productService.getProductStock(id);
  }

  @Mutation((returns) => ProductSchema)
  @Roles('admin')
  @UseGuards(new AuthGuard(), new SellerGuard())
  async createProduct(
    @Args('data') data: CreateProductInput,
    @Context('user') user: any,
  ) {
    return this.productService.store(data, user.id);
  }

  @Mutation((returns) => ProductEntity)
  @UseGuards(new AuthGuard(), new SellerGuard())
  updateProduct(
    @Args('data') data: CreateProductInput,
    @Context('user') user: any,
    @Args('id') productId: string,
  ) {
    return this.productService.update(productId, data, user.id);
  }
  @Mutation((returns) => ProductEntity)
  @UseGuards(new AuthGuard(), new SellerGuard())
  async deleteProduct(@Context('user') user: any, @Args('id') id: string) {
    return this.productService.destroy(id, user.id);
  }
}

@Resolver(() => StockSchema)
export class StockResolver {
  constructor(private readonly productService: ProductService) {}

  @Query((returns) => StockSchema)
  showStock(@Args('id') id: string) {
    return this.productService.showStock(id);
  }

  @Mutation((returns) => StockSchema)
  @Roles('admin')
  @UseGuards(new AuthGuard(), new SellerGuard())
  async createStock(
    @Args('data') data: CreateStockInput,
    @Context('user') user: any,
  ) {
    console.log('create stock', data);

    const p = await this.productService.createStock(data, user.id);
    p.created_at = new Date(p.created_at);
    return p;
  }

  @Mutation((returns) => StockSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  updateStock(
    @Args('data') data: UpdateStockInput,
    @Context('user') user: any,
    @Args('id') stockId: string,
  ) {
    return this.productService.updateStock(stockId, data, user.id);
  }
  @Mutation((returns) => StockSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  consumeStock(
    @Context('user') user: any,
    @Args('productId') productId: string,
  ) {
    return this.productService.consumeStock(productId, user.id);
  }
  @Mutation((returns) => StockSchema)
  @UseGuards(new AuthGuard(), new SellerGuard())
  async deleteStock(@Context('user') user: any, @Args('id') id: string) {
    return this.productService.destroyStock(id, user.id);
  }
}
