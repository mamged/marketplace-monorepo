import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { StockEntity } from '../stocks/stock.entity';
export enum variantType {
  INSTANT = 'INSTANT',
  ON_DEMAND = 'ON_DEMAND'
}
registerEnumType(variantType, {
  name: 'VariantType',
  description: 'Show the status of stock item.',
  valuesMap: {
    INSTANT: {
      description: 'The product is already stocked and will be sent to the user instantly after payment approval',
    },
    ON_DEMAND: {
      description: 'The seller will send the product later to the user via his dashboard',
    }
  },
});


@Entity('variants')
@InputType('variantEntityInput')
@ObjectType('variantEntitySchema')
export class VariantEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Field(returns => ProductEntity)
  @ManyToOne((type) => ProductEntity, (product) => product.variants)
  product: ProductEntity;

  @Field(of => [StockEntity])
  @OneToMany(type=> StockEntity, stock=> stock.variant)
  stock: StockEntity[];

  @Field({ defaultValue: 1 })
  @Column('integer', { default: 1 })
  quantity: number;

  @Field(of=> variantType, {
    defaultValue: variantType.INSTANT
  })
  @Column({
    type: 'enum',
    enum: variantType,
    default: variantType.INSTANT,
  })
  type: variantType;

  
  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  @Column('text')
  @Field()
  name: string;

  @MinLength(32)
  @MaxLength(1255)
  @IsNotEmpty()
  @Field({ nullable: true })
  @Column('text')
  description: string;

  @Min(1)
  @Max(9999)
  @IsNotEmpty()
  @IsNumber()
  @Field()
  @Column('float')
  price: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @UpdateDateColumn()
  updated_at: Date;

  @Field()
  @DeleteDateColumn()
  deletedAt?: Date;
}
