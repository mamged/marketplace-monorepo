import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository, getManager } from "typeorm";
import { RpcException } from "@nestjs/microservices";

import { CategoryEntity } from "./category.entity";
import { CategoryDTO } from "@commerce/shared";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categories: Repository<CategoryEntity>,
    ) {}
    async get(data: any = undefined): Promise<CategoryEntity[]> {
        const mgr = getManager();
        const trees  = await mgr.getTreeRepository(CategoryEntity).findTrees();
        console.log('treestreestrees:',trees);
        
        return trees;
    }
    fetchCategoriesByIds(ids: Array<string>) {
        return this.categories
            .createQueryBuilder("categories")
            .where(`categories.id IN (:...ids)`, { ids })
            .getMany();
    }
    async store(data: any): Promise<CategoryEntity> {
        console.log('<<data>>', data);
        // if(data.parent){
        //     const parent: CategoryEntity = await this.show(data.parent);
        //     console.log('<<parent>>', parent);
            
        //     data.parent = parent;
        // }
        // if(data.children && data.children.length>0){
        //     const children: CategoryEntity[] = await this.fetchCategoriesByIds(data.children)
        //     data.children = children;
        // }
        return this.categories.save(data);
    }

    async update(
        id: string,
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
