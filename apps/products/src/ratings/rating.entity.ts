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
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { VariantEntity } from '../variant/variant.entity';
import { ProductEntity } from '../products/product.entity';

@ObjectType('ratingEntitySchema')
@InputType('ratingEntityInput')
@Entity('rating')
export class RatingEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type=> ProductEntity, variant=> variant.ratings)
  product: ProductEntity;

  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @Field()
  @Column(()=> Number)
  value: number;

  @IsNotEmpty()
  @Field()
  @Column('text')
  userId: string;

  @Field({nullable: true})
  @Column('text', {nullable: true})
  description: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
