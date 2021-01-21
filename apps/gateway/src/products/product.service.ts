import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import { Injectable } from "@nestjs/common";
import { UserDTO, ProductDTO } from "@commerce/shared";

import { config } from "@commerce/shared";
import { redis, redisProductsKey, redisStocksKey } from "../utils/redis";
// import { ProductEntity } from "apps/products/src";
import { ProductEntity, StockEntity } from "@commerce/products";
import { CreateProductInput } from "./input/create-product.input";
import { ProductSchema } from "./schema/product.schema";
import { CreateStockInput } from "./input/create-stock.input";
import { StockSchema } from "./schema/stock.schema";
import { UpdateStockInput } from "./input/update-stock.input";
@Injectable()
export class ProductService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
    }
  })
  private client: ClientProxy;
  async show(id: string): Promise<ProductDTO> {
    return new Promise((resolve, reject) => {
      ProductEntity
      this.client
        .send<ProductDTO>("show-product", id)
        .subscribe(product => resolve(product), error => reject(error));
    });
  }
  showStock(id: string): Promise<StockEntity> {
    return new Promise((resolve, reject) => {
      ProductEntity
      this.client
        .send<StockSchema>("show-stock", id)
        .subscribe(product => resolve(product), error => reject(error));
    });
  }
  async getProductStock(id: string): Promise<StockEntity[]> {
    return new Promise((resolve, reject) => {
      ProductEntity
      this.client
        .send<StockSchema[]>("get-product-stock", id)
        .subscribe(product => resolve(product), error => reject(error));
    });
  }
  async get(): Promise<ProductEntity[]> {
    return new Promise((resolve, reject) => {
      // get products through cache.
      redis.get(redisProductsKey, (err, products) => {
        // if products don't persist, retrieve them, and store in redis.
        if (!products) {
          this.client.send<ProductEntity[]>("products", []).subscribe(
            (products: ProductEntity[]) => {
              redis.set(
                redisProductsKey,
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
  store(data: CreateProductInput, id: string): Promise<ProductSchema> {  
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<ProductSchema>("create-product", {
          ...data,
          user_id: id
        })
        .subscribe(
          (product) => {
            // fix date values to be valid with gql type
            product.created_at = new Date(product.created_at);
            product.updated_at = new Date(product.updated_at);
            redis.del(redisProductsKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }

  createStock(data: CreateStockInput, id: string): Promise<StockSchema> {  
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<StockSchema>("create-stock", {
          ...data
        })
        .subscribe(
          (stock) => {
            // fix date values to be valid with gql type
            stock.created_at = new Date(stock.created_at);
            stock.updated_at = new Date(stock.updated_at);
            redis.del(redisStocksKey);
            return resolve(stock);
          },
          error => reject(error)
        );
    });
  }

  update(
    productId: string,
    data: CreateProductInput,
    id: string
  ): Promise<ProductDTO> {
    return new Promise((resolve, reject) => {
      this.client
        .send<ProductDTO>("update-product", {
          ...data,
          id: productId,
          user_id: id
        })
        .subscribe(
          product => {
            redis.del(redisProductsKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }

  updateStock(
    stockId: string,
    stock: UpdateStockInput,
    userId: string
  ): Promise<StockEntity> {
    return new Promise((resolve, reject) => {
      this.client
        .send<StockEntity>("update-stock", {stockId, stock, userId})
        .subscribe(
          product => {
            redis.del(redisProductsKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }
  async fetchProductsByIds(ids: string[]): Promise<ProductDTO[]>{
    return this.client
      .send<ProductDTO[], string[]>("fetch-products-by-ids", ids)
      .toPromise<ProductDTO[]>();
  }
  destroy(productId: string, id: string) {
    return new Promise((resolve, reject) => {
      this.client
        .send<ProductDTO>("delete-product", {
          id: productId,
          user_id: id
        })
        .subscribe(
          product => {
            redis.del(redisProductsKey);
            return resolve(product);
          },
          error => reject(error)
        );
    });
  }
}
