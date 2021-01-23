import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  BaseEntity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity('addresses')
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  address_1: string;

  @Field()
  @Column('text', { nullable: true })
  address_2: string;

  @Field()
  @Column('text')
  city: string;

  @Field()
  @Column('text')
  state: string;

  @Field()
  @Column('text')
  country: string;

  @Field()
  @Column('integer')
  zip: number;

  @OneToOne(() => UserEntity, (user) => user.address)
  @JoinColumn()
  user: UserEntity;
}
