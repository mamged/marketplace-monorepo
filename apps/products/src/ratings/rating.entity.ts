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

export enum ratingStatus {
  CONSUMED = 'consumed',
  AVAILABLE = 'available',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}
registerEnumType(ratingStatus, {
  name: 'RatingStatus',
  description: 'Show the status of rating item.',
  valuesMap: {
    CONSUMED: {
      description: 'Means a user purchased this rating item.',
    },
    AVAILABLE: {
      description: 'Rating item is available.',
    },
    DISABLED: {
      description: 'Rating item is disable by seller.',
    },
    DELETED: {
      description: 'Rating item is deleted by seller.',
    },
  },
});

@ObjectType('ratingEntitySchema')
@InputType('ratingEntityInput')
@Entity('rating')
export class RatingEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(returns => ratingStatus, {
    defaultValue: ratingStatus.AVAILABLE,
    nullable: true,
  })
  @Column({
    type: 'enum',
    enum: ratingStatus,
    default: ratingStatus.AVAILABLE,
  })
  status: ratingStatus;

  @ManyToOne(type=> ProductEntity, variant=> variant.rating)
  product: ProductEntity;

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
