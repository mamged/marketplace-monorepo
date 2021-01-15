import { UserSchema } from "@commerce/gateway/users/schema/me.schema";
import { ProductEntity } from "@commerce/products";
import { UserEntity } from "@commerce/users";
import { Field, ObjectType, OmitType } from "@nestjs/graphql";

@ObjectType()
export class ProductSchema extends ProductEntity{
    @Field()
    user: UserSchema
}