import {
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOrder } from '@commerce/shared';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Show the status of stock item.',
  valuesMap: {
    PENDING: {},
    FAILED: {},
    SUCCEEDED: {}
  },
});

@ObjectType("OrdersEntityObject")
// @InputType("OrdersEntityInput")
@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Field()
  @Column('integer', { default: 0 })
  total_price: number;

  @Field(of=> [ProductOrder])
  @Column({ type: 'simple-json' })
  products: ProductOrder[];

  @Field(of=> OrderStatus, {
    defaultValue: OrderStatus.PENDING
  })
  @Column({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
