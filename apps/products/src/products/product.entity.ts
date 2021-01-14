import { Field, ObjectType } from "@nestjs/graphql";
import {
    Column,
    Entity,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

@Entity("products")
@ObjectType()
export class ProductEntity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column("integer")
    price: number;
    @Field()
    @PrimaryGeneratedColumn("uuid")
    user_id: string;
    
    @Field()
    @Column("integer", { default: 1 })
    quantity: number;

    @Field()
    @Column("text", { unique: true })
    title: string;

    @Field()
    @Column("text")
    description: string;


    @Field()
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    image: string;

    @Field()
    @CreateDateColumn()
    created_at: Date;
    @Field()
    @UpdateDateColumn()
    updated_at: Date;
}
