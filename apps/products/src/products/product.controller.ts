import { Controller } from "@nestjs/common";
import { MessagePattern, EventPattern } from "@nestjs/microservices";

import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
    constructor(private readonly products: ProductService) {}

    @MessagePattern("products")
    index(data: any = undefined, arg2, arg3): Promise<ProductEntity[]> {
        return this.products.get(data);
    }

    @MessagePattern("create-product")
    store(product: ProductEntity): Promise<ProductEntity> {
        return this.products.store(product);
    }

    @MessagePattern("update-product")
    update(product: ProductEntity): Promise<ProductEntity> {
        const {
            id,
            title,
            description,
            image,
            price,
            user_id
        } = product;
        return this.products.update(
            id,
            { title, description, image, price },
            user_id
        );
    }

    @MessagePattern("show-product")
    show(id: string): Promise<ProductEntity> {
        return this.products.show(id);
    }
    @MessagePattern("fetch-products-by-ids")
    fetchProductsByIds(ids: Array<string>) {
        return this.products.fetchProductsByIds(ids);
    }
    @EventPattern("order_deleted")
    async handleOrderDeleted(
        products: Array<{ id: string; quantity: number }>
    ) {
        this.products.incrementProductsStock(products);
    }
    @EventPattern("order_created")
    async handleOrderCreated(
        products: Array<{ id: string; quantity: number }>
    ) {
        this.products.decrementProductsStock(products);
    }

    @MessagePattern("delete-product")
    destroy({ id, user_id }: { id: string; user_id: string }) {
        return this.products.destroy(id, user_id);
    }
}
