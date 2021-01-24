import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

import { config } from '@commerce/shared';
import { redis, redisVariantsKey } from '../utils/redis';
// import { VariantEntity } from "apps/variants/src";
import { ProductEntity, VariantEntity } from '@commerce/products';
import { CreateVariantInput } from './input/create-variant.input';
import { VariantSchema } from './schema/variant.schema';
import { UpdateVariantInput } from './input/update-variant.input';
@Injectable()
export class VariantService {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`,
    },
  })
  private client: ClientProxy;
  showVariant(id: string): Promise<VariantSchema> {
    return new Promise((resolve, reject) => {
      VariantEntity;
      this.client.send<VariantSchema>('show-variant', id).subscribe(
        (variant) => resolve(variant),
        (error) => reject(error),
      );
    });
  }
  async getVariantProduct(id: string): Promise<ProductEntity> {
    return new Promise((resolve, reject) => {
      this.client
        .send<ProductEntity>('get-product-by-variant-id', id)
        .subscribe(
          (variant) => resolve(variant),
          (error) => reject(error),
        );
    });
  }

  createVariant(data: CreateVariantInput, id: string): Promise<VariantSchema> {
    // TODO: handle the failure create produc
    return new Promise((resolve, reject) => {
      this.client
        .send<VariantSchema>('create-variant', {
          ...data,
        })
        .subscribe(
          (variant) => {
            redis.del(redisVariantsKey);
            return resolve(variant);
          },
          (error) => reject(error),
        );
    });
  }
  updateVariant(
    variantId: string,
    variant: UpdateVariantInput,
    userId: string,
  ): Promise<VariantEntity> {
    return new Promise((resolve, reject) => {
      this.client
        .send<VariantEntity>('update-variant', { variantId, variant, userId })
        .subscribe(
          (variant) => {
            redis.del(redisVariantsKey);
            return resolve(variant);
          },
          (error) => reject(error),
        );
    });
  }
  destroyVariant(variantId: string, id: string) {
    return new Promise((resolve, reject) => {
      this.client
        .send<VariantSchema>('delete-variant', {
          id: variantId,
          user_id: id,
        })
        .subscribe(
          (variant) => {
            redis.del(redisVariantsKey);
            return resolve(variant);
          },
          (error) => reject(error),
        );
    });
  }
}
