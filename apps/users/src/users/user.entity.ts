import {
    Column,
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert
} from "typeorm";
import { AddressEntity } from "./address.entity";
import { sign } from "jsonwebtoken";
import { config } from "@commerce/shared";
import { hash } from "bcryptjs";
import { Field, ObjectType } from "@nestjs/graphql";
@ObjectType()
@Entity("users")
export class UserEntity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Field()
    @Column({ type: "boolean" })
    seller: boolean;

    
    @Field()
    @Column("text")
    name: string;
    
    @Field()
    @Column("text", { unique: true })
    email: string;
    
    @Field()
    @Column("text")
    password: string;
    
    @Field()
    @Column("text", { nullable: true })
    gateway_customer_id: string;

    @Field()
    @CreateDateColumn()
    created_at: Date;
    @Field()
    @UpdateDateColumn()
    updated_at: Date;

    @Field(type=> AddressEntity)
    @OneToOne(() => AddressEntity, address => address.user)
    address: AddressEntity;
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }
    private get token() {
        const { id, seller } = this;
        return sign({ id, seller }, config.JWT_TOKEN, {
            expiresIn: config.JWT_TOKEN_EXPIRATION
        });
    }
    toResponseObject(showToken: boolean = true) {
        const {
            id,
            created_at,
            name,
            email,
            token,
            updated_at,
            seller,
            address,
            gateway_customer_id
        } = this;
        let responseObject: any = {
            id,
            name,
            email,
            created_at,
            updated_at,
            seller,
            gateway_customer_id
        };
        if (address) {
            responseObject.address = address;
        }
        if (showToken) {
            responseObject.token = token;
        }
        return responseObject;
    }
}
