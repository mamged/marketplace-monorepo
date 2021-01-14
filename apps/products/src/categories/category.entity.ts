import { Field, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import {Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent, JoinColumn} from "typeorm";

@ObjectType()
@Entity()
@Tree("materialized-path")
export class CategoryEntity {


    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: string;

    @Field(type=> [CategoryEntity], {nullable: true})
    @TreeChildren()
    children: CategoryEntity[];

    @Field(type=> CategoryEntity, {nullable: true})
    @TreeParent()
    parent: CategoryEntity;

}