import { ProductDTO } from './product.dto';
import { UserDTO } from './user.dto';
import { Field, ID, InputType, InterfaceType, ObjectType } from '@nestjs/graphql';
import { ProductSchema } from '@commerce/gateway/products/schema/product.schema';
import { UserSchema } from '@commerce/gateway/users/schema/me.schema';

@ObjectType("ProductOrderObject")
// @InputType("ProductOrderInputDTO")
export class ProductOrder {
  @Field(type => ProductSchema)
  product: ProductSchema;

  @Field()
  quantity: number;
}
export abstract class OrderDTO {
  @Field(type => UserSchema)
  user: UserSchema;
  @Field()
  totalPrice: number;
  @Field(type => ProductOrder)
  products: ProductOrder[];
  @Field(type => Date)
  created_at: Date;
}
