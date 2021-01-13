import { Controller } from "@nestjs/common";
import { MessagePattern, EventPattern } from "@nestjs/microservices";

import { CategoryEntity } from "./category.entity";
import { CategoryService } from "./category.service";

@Controller("products")
export class ProductController {
    constructor(private readonly products: CategoryService) {}

    @MessagePattern("create-product")
    store(data: any): Promise<CategoryEntity> {
        return this.products.store(data);
    }

    @MessagePattern("update-product")
    update(category: CategoryEntity): Promise<CategoryEntity> {
        const {
            id,
            name,
            children,
            parent
        } = category;
        return this.products.update(
            id,
            { name, children, parent }
        );
    }

    @MessagePattern("show-product")
    show(id: string): Promise<CategoryEntity> {
        return this.products.show(id);
    }

    @MessagePattern("delete-product")
    destroy({ id, user_id }: { id: string; user_id: string }) {
        return this.products.destroy(id, user_id);
    }
}
