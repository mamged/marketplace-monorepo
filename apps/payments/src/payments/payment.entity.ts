import {
    Column,
    Entity,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne
} from "typeorm";
import { UserEntity } from "@commerce/users";

@Entity("payments")
export class PaymentEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @PrimaryGeneratedColumn("uuid")
    user_id: string;
    @Column("text", { nullable: true })
    brand: string;
    @Column("text", { nullable: true })
    last_four: string;
    @Column("boolean", { default: true })
    default: boolean;
    @Column("text", { unique: true })
    provider_id: string;

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    
    // @Column('text')
    // @ManyToOne(type=> UserEntity, user=> user.gateway_customer_id, {eager: false})
    // user: UserEntity
}
