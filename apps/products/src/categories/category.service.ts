import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";

import { CategoryEntity } from "./category.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categories: Repository<CategoryEntity>
    ) {}
    get(data: any = undefined): Promise<CategoryEntity[]> {
        return this.categories.find(data);
    }
    fetchCategoriesByIds(ids: Array<string>) {
        return this.categories
            .createQueryBuilder("categories")
            .where(`categories.id IN (:...ids)`, { ids })
            .getMany();
    }
    store(data: any): Promise<CategoryEntity> {
        console.log('<<data>>', data, '<<<');
        
        return this.categories.save(data);
    }

    async update(
        id: number,
        data: any
    ): Promise<CategoryEntity> {
        const category = await this.categories.findOneOrFail(id);
        if (category) {
            await this.categories.update(id, data);
            return this.categories.findOneOrFail(id);
        }
        throw new RpcException(
            new NotFoundException("You cannot update what you don't own...")
        );
    }
    async show(id: string): Promise<CategoryEntity> {
        return this.categories.findOneOrFail(id);
    }
    async destroy(id: string, user_id: string): Promise<CategoryEntity> {
        const category = await this.categories.findOneOrFail(id);
        if (category) {
            await this.categories.delete(id);
            return category;
        }
        throw new RpcException(
            new NotFoundException("You cannot update what you don't own...")
        );
    }
}
