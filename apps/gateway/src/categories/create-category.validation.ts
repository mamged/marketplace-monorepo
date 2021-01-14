import { ObjectType } from "@nestjs/graphql";
import {
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsUrl,
    Min,
    Max,
    IsInt,
    isURL,
    IsArray
} from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { CategoryEntity } from "@commerce/products";
@InputType()
@ObjectType()
export class CreateCategory {
    @MinLength(3)
    @MaxLength(32)
    @IsNotEmpty()
    @Field()
    name: string;
    
    @Field()
    children: number[]

    @Field()
    parent: number
}
