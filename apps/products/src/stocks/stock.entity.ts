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

export enum stockStatus {
  CONSUMED = 'consumed',
  AVAILABLE = 'available',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}
registerEnumType(stockStatus, {
  name: 'StockStatus',
  description: 'Show the status of stock item.',
  valuesMap: {
    CONSUMED: {
      description: 'Means a user purchased this stock item.',
    },
    AVAILABLE: {
      description: 'Stock item is available.',
    },
    DISABLED: {
      description: 'Stock item is disable by seller.',
    },
    DELETED: {
      description: 'Stock item is deleted by seller.',
    },
  },
});
@Entity('stocks')
@ObjectType()
export class StockEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((returns) => ProductEntity)
  @ManyToOne((type) => ProductEntity, (product) => product.stock)
  product: ProductEntity;

  @Field((returns) => stockStatus, {
    defaultValue: stockStatus.AVAILABLE,
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: stockStatus,
    default: stockStatus.AVAILABLE,
  })
  status: stockStatus;

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
