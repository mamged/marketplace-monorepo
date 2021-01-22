import {
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOrder } from '@commerce/shared';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column('integer', { default: 0 })
  total_price: number;

  @Column({ type: 'simple-json' })
  public products: ProductOrder[];
  @Column({
    enum: ['pending', 'failed', 'succeeded'],
    default: 'pending',
  })
  status: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
