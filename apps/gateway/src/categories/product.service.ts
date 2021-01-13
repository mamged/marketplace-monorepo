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
  async show(id: string): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      CategoryEntity
      this.client
        .send<CategoryDTO>("show-product", id)
        .subscribe(product => resolve(product), error => reject(error));
    });
  }
  async get(): Promise<CategoryDTO[]> {
    return new Promise((resolve, reject) => {
      // get products through cache.
      redis.get(redisCategoriesKey, (err, products) => {
        // if products don't persist, retrieve them, and store in redis.
        if (!products) {
          this.client.send<CategoryDTO[]>("products", []).subscribe(
            products => {
              redis.set(
                redisCategoriesKey,
                JSON.stringify(products),
                "EX",
                60 * 60 * 30 // 30 mins until expiration
              );
              return resolve(products);
            },
            error => reject(error)
          );
        }
        // return the parsed products from cache.
        resolve(JSON.parse(products));
      });
    });
  }
  store(data: CreateCategory, id: string): Promise<CategoryDTO> {
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<CategoryDTO>("create-product", {
          ...data,
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
  update(
    data: CreateCategory,
    productId: string,
    id: string
  ): Promise<CategoryDTO> {
    return new Promise((resolve, reject) => {
      this.client
        .send<CategoryDTO>("update-product", {
          ...data,
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
  async fetchCategoriesByIds(ids: string[]): Promise<CategoryDTO[]>{
    return this.client
      .send<CategoryDTO[], string[]>("fetch-products-by-ids", ids)
      .toPromise<CategoryDTO[]>();
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
