import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getRepository, QueryFailedError, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

import { VariantEntity, variantStatus } from './variant.entity';
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
    // variant.product = this.productService.show(variant.product.to)
    const newVariant = new VariantEntity();
    newVariant.title = variant.title;
    newVariant.description = variant.description;
    // newVariant.product = await this.productService.show(variant.product);
    const product = new ProductEntity();
    // product.id = variant.product;
    product.quantity = 1;
    return this.Variants.save(newVariant).catch((error) => {
      throw new RpcException(new BadRequestException(error.message));
    });
  }

  /**
   * a signle source of truth function to make variant updates
   * @param oldVariant the variant item which needs to be updated
   * @param newVariant the payload which the variant item will be updated to
   */
  updateProductQuantityIfNeeded(oldVariant: VariantEntity, newVariant: UpdateVariantInput){
    if (
      oldVariant.status === variantStatus.AVAILABLE &&
      newVariant.status !== variantStatus.AVAILABLE
    ) {
      oldVariant.product.quantity = 1;
      // this.productService.decrementProductsVariant([oldVariant.product]);
    } else if(
      oldVariant.status !== variantStatus.AVAILABLE &&
      newVariant.status === variantStatus.AVAILABLE
    ){
      oldVariant.product.quantity = 1;
      // this.productService.incrementProductsVariant([oldVariant.product]);
    }
  }
  async update(
    id: string,
    newVariantData: UpdateVariantInput,
    userId: string,
    ignoreUserValidation = false
  ): Promise<VariantEntity> {
    const oldVariant = await this.Variants.findOneOrFail({ where:{id}, relations:["product"] });
    if(ignoreUserValidation === true || (oldVariant.product.user_id === userId)){
      await this.Variants.update(id, newVariantData);
      // if there is update on status we need to make sure product quantity is up to date
      if (newVariantData.status) {
        this.updateProductQuantityIfNeeded(oldVariant, newVariantData)
      }
      const newVariant = await this.Variants.findOneOrFail({ id });
      return newVariant;
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<VariantEntity> {
    return this.Variants.findOneOrFail({ id });
  }
  async getProductByVariantId(id: string): Promise<VariantEntity> {
    return this.Variants.findOneOrFail({ where: { id }, relations: ['product'] });
  }
  async destroy(id: string, user_id: string): Promise<VariantEntity> {
    try {
      const variant = await this.update(
        id,
        { status: variantStatus.DELETED },
        user_id,
      );
      return variant;
    } catch (error) {
      throw new RpcException(
        new NotFoundException("You cannot update what you don't own..."),
      );
    }
  }
  async getVariantByProductId(id: string) {
    return this.Variants.find({
      where: {
        product: id,
        status: variantStatus.AVAILABLE,
      },
    });
  }
  async consumeVariant(productId: string, user_id: string) {
    let variant;
    try {
      variant = await this.Variants.findOneOrFail({
        where: {
          product: productId,
          status: variantStatus.AVAILABLE,
        },
      });
    } catch (error) {
      return new RpcException(
        new NotFoundException('cannot find available variant'),
      );
    }
    variant.status = variantStatus.CONSUMED;
    this.update(variant.id, variant, user_id)
    return variant;
  }
  async incrementVariantsVariant(Variants) {
    Variants.forEach((variant) => {
      this.Variants.increment({ id: variant.id }, 'quantity', variant.quantity);
    });
  }
}
