import { CreateProductInput } from '@commerce/gateway';
import { UpdateProductInput } from '@commerce/gateway';
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { StockEntity } from '../stocks/stock.entity';

import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly products: ProductService) {}

  @MessagePattern('products')
  index(data: any = undefined, arg2, arg3): Promise<ProductEntity[]> {
    return this.products.get(data);
  }
  @MessagePattern('get-product-stock')
  getProductStock(id: string): Promise<StockEntity[]> {
    return this.products.getProductStock(id);
  }

  @MessagePattern('create-product')
  store(product: CreateProductInput): Promise<ProductEntity> {
    return this.products.store(product);
  }

  @MessagePattern('update-product')
  update(product: UpdateProductInput): Promise<ProductEntity> {
    const { id, user_id, ...data } = product;
    return this.products.update(
      id,
      data,
      user_id,
    );
  }

  @MessagePattern('show-product')
  show(id: string): Promise<ProductEntity> {
    return this.products.show(id);
  }
  @MessagePattern('fetch-products-by-ids')
  fetchProductsByIds(ids: Array<string>) {
    return this.products.fetchProductsByIds(ids);
  }
  @MessagePattern('get-product-variants')
  getProductVariants(productId: string) {
    return this.products.getVariants(productId);
  }
  @EventPattern('order_deleted')
  async handleOrderDeleted(products: Array<ProductEntity>) {
    products.forEach(p=>this.products.updateProductQuantity(p.id));
  }
  @EventPattern('order_created')
  async handleOrderCreated(products: Array<ProductEntity>) {
    products.forEach(p=>this.products.updateProductQuantity(p.id));
  }

  @MessagePattern('delete-product')
  destroy({ id, user_id }: { id: string; user_id: string }) {
    return this.products.destroy(id, user_id);
  }
}
