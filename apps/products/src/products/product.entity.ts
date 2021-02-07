import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsInt,
  IsArray,
  IsNumber,
  IsBoolean,
  isURL,
  validateOrReject,
} from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  PrimaryColumn,
  Index,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { VariantEntity } from '../variant/variant.entity';
import { StockEntity } from '../stocks/stock.entity';
import { RatingEntity } from '../ratings/rating.entity';
import { RatingResolver } from '@commerce/gateway/ratings/rating.resolver';
import { RatingSchema } from '@commerce/gateway';

@Entity('products')
@ObjectType()
@InputType("ProductEntityInput")
@Index((relation: ProductEntity ) => [relation.user_id, relation.id], { unique: true })
export class ProductEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  user_id: string;

  @IsBoolean()
  @Field(()=> Boolean, {defaultValue: false})
  // TODO: remove nullable: true
  @Column({type: "boolean", nullable: true})
  published: boolean;

  @Min(1)
  @Max(9999)
  @IsNotEmpty()
  @IsNumber()
  @Field()
  @Column('float')
  price: number;

  @Field()
  @Column('integer', { default: 0 })
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
  @Field()
  @Column('text')
  description: string;

  @IsArray()
  @IsNotEmpty()
  @Field((of) => [String])
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  image: string[];

  // @Field(()=> [VariantEntity])
  // @Column()
  @OneToMany((type) => VariantEntity, (varient) => varient.product)
  variants: VariantEntity[];
  @OneToMany((type) => StockEntity, (stock) => stock.product)
  stock: StockEntity[];
  
  @Field(of=> [RatingEntity])
  @OneToMany((type) => RatingEntity, (rating) => rating.product)
  ratings: RatingEntity[];

  @Field()
  @CreateDateColumn()
  created_at: Date;
  // @Field(of=> GraphQLISODateTime)
  @Field()
  @UpdateDateColumn()
  updated_at: Date;
}
