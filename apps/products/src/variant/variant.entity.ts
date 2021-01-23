import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsInt,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

export enum variantStatus {
  CONSUMED = 'consumed',
  AVAILABLE = 'available',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}
registerEnumType(variantStatus, {
  name: 'VariantStatus',
  description: 'Show the status of variant item.',
  valuesMap: {
    CONSUMED: {
      description: 'Means a user purchased this variant item.',
    },
    AVAILABLE: {
      description: 'Variant item is available.',
    },
    DISABLED: {
      description: 'Variant item is disable by seller.',
    },
    DELETED: {
      description: 'Variant item is deleted by seller.',
    },
  },
});
@Entity('variants')
@ObjectType()
export class VariantEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((returns) => ProductEntity)
  @ManyToOne((type) => ProductEntity, (product) => product.variant)
  product: ProductEntity;

  @Field((returns) => variantStatus, {
    defaultValue: variantStatus.AVAILABLE,
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: variantStatus,
    default: variantStatus.AVAILABLE,
  })
  status: variantStatus;

  @Field({ defaultValue: 1 })
  @Column('integer', { default: 1 })
  quantity: number;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Field()
  // UNCOMMENT ME some time later!! @Column("text", { unique: true })
  @Column('text')
  title: string;

  @MinLength(32)
  @MaxLength(1255)
  @IsNotEmpty()
  @Field({ nullable: true })
  @Column('text')
  description: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
  // @Field(of=> GraphQLISODateTime)
  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
