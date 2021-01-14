import { Controller } from "@nestjs/common";
import { MessagePattern, EventPattern } from "@nestjs/microservices";

import { CategoryEntity } from "./category.entity";
import { CategoryService } from "./category.service";

@Controller("category")
export class CategoryController {
    constructor(private readonly category: CategoryService) {}

    @MessagePattern("categories")
    async categories(): Promise<CategoryEntity[]> {
        console.log('all categories');
        return this.category.get({});
    }

    @MessagePattern("create-category")
    store(data: any): Promise<CategoryEntity> {
        console.log('create-category: controller', data);
        
        return this.category.store(data);
    }

    @MessagePattern("update-category")
    update(category: CategoryEntity): Promise<CategoryEntity> {
        const {
            id,
            name,
            children,
            parent
        } = category;
        return this.category.update(
            id,
            { name, children, parent }
        );
    }

    @MessagePattern("show-category")
    show(id: string): Promise<CategoryEntity> {
        return this.category.show(id);
    }

    @MessagePattern("fetch-categories-by-ids")
    fetchCategoriesByIds(ids: string[]): Promise<CategoryEntity[]> {
        return this.category.fetchCategoriesByIds(ids)
    }

    @MessagePattern("delete-category")
    destroy({ id, user_id }: { id: string; user_id: string }) {
        return this.category.destroy(id, user_id);
    }
}
