import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { ProductEntity } from '../products/product.entity';

@ObjectType()
@InputType()
@Entity('variants')
export class VariantEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((returns) => ProductEntity)
  @ManyToOne((type) => ProductEntity, (product) => product.variants)
  product: ProductEntity;

  @Field({ defaultValue: 1 })
  @Column('integer', { default: 1 })
  quantity: number;

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

  @DeleteDateColumn()
  deletedAt?: Date;
}
