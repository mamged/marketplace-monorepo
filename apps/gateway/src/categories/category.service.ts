import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { Injectable } from "@nestjs/common";
import { UserDTO, CategoryDTO } from "@commerce/shared";

import { config } from "@commerce/shared";
import { redis, redisCategoriesKey } from "../utils/redis";
import { CreateCategory } from "./create-category.validation";
// import { CategoryEntity } from "apps/products/src";
import { CategoryEntity } from "@commerce/products";
@Injectable()
export class CategoryService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
    }
  })
  private client: ClientProxy;

  async show(id: string): Promise<CategoryEntity> {
    return new Promise((resolve, reject) => {
      CategoryEntity
      this.client
        .send<CategoryEntity>("show-category", id)
        .subscribe(product => resolve(product), error => reject(error));
    });
  }
  async get(): Promise<CategoryEntity[]> {
    return new Promise((resolve, reject) => {
      // get categories through cache.
      redis.get(redisCategoriesKey, (err, categories) => {
        console.log('redis categories', categories);
        
        // if categories don't persist, retrieve them, and store in redis.
        if (!categories) {
          this.client.send<CategoryEntity[]>("categories", []).subscribe(
            categories => {
              redis.set(
                redisCategoriesKey,
                JSON.stringify(categories),
                "EX",
                60 * 60 * 30 // 30 mins until expiration
              );
              return resolve(categories);
            },
            error => reject(error)
          );
        }
        // return the parsed categories from cache.
        resolve(JSON.parse(categories));
      });
    });
  }
  store(data: CreateCategory): Promise<CategoryDTO> {
    
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<CategoryDTO>("create-category", {
          ...data
        })
        .subscribe(
          category => {
            redis.del(redisCategoriesKey);
            return resolve(category);
          },
          error => {
            console.log('catch@@@');
            return reject(error);
          }
        );
    });
  }
  update(
    data: CreateCategory,
    categoryId: number
  ): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      this.client
        .send<CategoryDTO>("update-product", {
          ...data,
          id: categoryId
        })
        .subscribe(
          product => {
            redis.del(redisCategoriesKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }
  async fetchCategoriesByIds(ids: string[]): Promise<CategoryEntity[]>{
    return this.client
      .send<CategoryEntity[], string[]>("fetch-products-by-ids", ids)
      .toPromise<CategoryEntity[]>();
  }
  destroy(productId: string, id: string) {
    return new Promise((resolve, reject) => {
      this.client
        .send<CategoryDTO>("delete-product", {
          id: productId,
          user_id: id
        })
        .subscribe(
          product => {
            redis.del(redisCategoriesKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }
}
