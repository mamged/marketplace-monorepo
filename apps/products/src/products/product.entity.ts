import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    Min,
    Max,
    IsInt,
    IsArray,
    IsNumber
} from "class-validator";
import { Field, GraphQLISODateTime, GraphQLTimestamp, ObjectType } from "@nestjs/graphql";
import {
    Column,
    Entity,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne
} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { UserEntity } from "@commerce/users";
import { UserSchema } from "@commerce/gateway/users/schema/me.schema";

@Entity("products")
@ObjectType()
export class ProductEntity extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Min(1)
    @Max(9999)
    @IsNotEmpty()
    @IsNumber()
    @Field()
    @Column("float")
    price: number;

    @Field()
    @PrimaryGeneratedColumn("uuid")
    user_id: string;
    
    @Field({defaultValue: 1})
    @Column("integer", { default: 1 })
    quantity: number;

    @MinLength(8)
    @MaxLength(32)
    @IsNotEmpty()
    @Field()
    // UNCOMMENT ME some time later!! @Column("text", { unique: true })
    @Column("text")
    title: string;

    @MinLength(32)
    @MaxLength(1255)
    @IsNotEmpty()
    @Field({nullable: true})
    @Column("text")
    description: string;


    @IsArray()
    @IsNotEmpty()
    @Field(of=> [String])
    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    image: string[];

    @Field()
    @CreateDateColumn()
    created_at: Date;
    // @Field(of=> GraphQLISODateTime)
    @Field()
    @UpdateDateColumn()
    updated_at: Date;
}
