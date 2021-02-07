import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { UserDTO, ProductDTO, OrderDTO, ProductOrder } from '@commerce/shared';

import { config } from '@commerce/shared';
import { redis, redisProductsKey } from '../utils/redis';
import { OrderEntity } from '@commerce/orders';
// import { Order } from "../schemas/graphql";
import { Product } from 'src/schemas/graphql';
import { OrderSchema } from './schema/order.schema';
import { ProductSchema } from '../products/schema/product.schema';
import { CreateProductInput } from '../products/input/create-product.input';
import { CreateOrderInput } from './input/create-order.input';
@Injectable()
export class OrderService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`,
    },
  })
  private client: ClientProxy;
  indexOrdersByUser(user_id: string): Promise<OrderSchema[]> {
    return new Promise((resolve, reject) => {
      this.client.send('index-orders', user_id).subscribe((orders) => {
        return resolve(orders);
      });
    });
  }
  async destroyUserOrder(order_id: any, user_id): Promise<OrderSchema> {
    return new Promise((resolve, reject) => {
      this.client
        .send('destroy-order-by-id', {
          id: order_id,
          user_id,
        })
        .subscribe(async (order) => {
          // fire an event that order is deleted to increase the product's quantity.
          this.client
            .emit('order_deleted', order.products)
            .subscribe(() => resolve(order));
        });
    });
  }
  store(products: any, user_id, fetchedProducts): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const mappedProducts = fetchedProducts
        .map((product) => {
          // find the product which user passed, to retrieve the ordered quantity.
          let orederedProduct = products.find((p) => p.id === product.id);
          if (orederedProduct) {
            return { ...product, ordered_quantity: orederedProduct.quantity };
          }
          return product;
        })
        .filter((product) => !!product.ordered_quantity);
      this.client
        .send('create_order', {
          products: mappedProducts,
          user_id,
        })
        .subscribe(
          (order) => {
            // fire an event to reduce the quantity of the products.
            this.client.emit('order_created', products).subscribe(
              () => {},
              () => {},
              () => resolve(order),
            ); // resolve on completion
          },
          (error) => reject(error),
        );
    });
  }
  createOrder(orderProducts: CreateOrderInput[], user): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      // fetch products user is trying to purchase to check on the quantity.
      this.client
        .send<ProductSchema[]>(
          'fetch-products-by-ids',
          orderProducts.map((product) => product.id),
        )
        .subscribe(
          async (fetchedProducts) => {
            const filteredProducts = orderProducts.filter((product) => {
              const pp: ProductSchema = fetchedProducts.find((p) => p.id === product.id);
              return pp.quantity >= product.quantity;
            });
            // there is something wrong with the quantity of passed products.
            if (filteredProducts.length != orderProducts.length) {
              return reject(
                'Products are out of stock at the moment, try with lower stock.',
              );
            }
            console.log('$$products$$',orderProducts);
            return resolve(
              await this.store(orderProducts, user.id, fetchedProducts)
            );
          },
          (error) => reject(error),
        );
    });
  }
}
