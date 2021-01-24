import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteResult,
  getRepository,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { VariantEntity } from './variant.entity';
import { CreateVariantInput } from '@commerce/gateway';
import { ProductEntity } from '../products/product.entity';
import { ProductService } from '../products/product.service';
import { UpdateVariantInput } from '@commerce/gateway';

@Injectable()
export class Variantservice {
  constructor(
    @InjectRepository(VariantEntity)
    private readonly Variants: Repository<VariantEntity>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}
  get(data: any = undefined): Promise<VariantEntity[]> {
    return this.Variants.find(data);
  }
  fetchVariantsByIds(ids: Array<string>) {
    return this.Variants.createQueryBuilder('Variants')
      .where(`Variants.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(variant: CreateVariantInput): Promise<any> {
    const newVariant = new VariantEntity();
    newVariant.name = variant.name;
    newVariant.price = variant.price;
    newVariant.description = variant.description;
    newVariant.product = await this.productService.show(variant.productId);
    return this.Variants.save(newVariant).catch((error) => {
      throw new RpcException(new BadRequestException(error.message));
    });
  }

  async update(
    id: string,
    newVariantData: UpdateVariantInput,
    userId: string,
    ignoreUserValidation = false,
  ): Promise<VariantEntity> {
    const oldVariant = await this.Variants.findOneOrFail({
      where: { id },
      relations: ['product'],
    });
    if (
      ignoreUserValidation === true ||
      oldVariant.product.user_id === userId
    ) {
      await this.Variants.update(id, newVariantData);
      const newVariant = await this.Variants.findOneOrFail({ id });
      return newVariant;
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  show(id: string): Promise<VariantEntity> {
    return this.Variants.findOneOrFail({ id }).catch(() => {
      throw new RpcException(
        new NotFoundException('Variant cannot be found...'),
      );
    });
  }
  async getProductByVariantId(id: string): Promise<ProductEntity> {
    const variant = await this.Variants.findOneOrFail({
      where: { id },
      relations: ['product'],
    }).catch(() => {
      throw new RpcException(
        new NotFoundException('Variant cannot be found...'),
      );
    });
    return variant.product;
  }
  async destroy(id: string, user_id: string): Promise<any> {
    const variant = await this.Variants.findOneOrFail({
      where: { id },
      relations: ['product'],
    }).catch(() => {
      throw new RpcException(
        new NotFoundException('Variant cannot be found...'),
      );
    });
    if (variant.product.user_id !== user_id)
      throw new RpcException(
        new NotFoundException("You cannot update what you don't own..."),
      );
    this.Variants.softRemove({ id }).catch(() => {
      throw new RpcException(
        new NotFoundException('Variant cannot be update...'),
      );
    });
    return variant;
  }
  async getVariantByProductId(id: string) {
    return this.Variants.find({
      where: {
        product: id,
      },
    });
  }
  async consumeVariant(productId: string, user_id: string) {
    let variant;
    try {
      variant = await this.Variants.findOneOrFail({
        where: {
          product: productId,
          // status: variantStatus.AVAILABLE,
        },
      });
    } catch (error) {
      return new RpcException(
        new NotFoundException('cannot find available variant'),
      );
    }
    // variant.status = variantStatus.CONSUMED;
    this.update(variant.id, variant, user_id);
    return variant;
  }
  async incrementVariantsVariant(Variants) {
    Variants.forEach((variant) => {
      this.Variants.increment({ id: variant.id }, 'quantity', variant.quantity);
    });
  }
}
