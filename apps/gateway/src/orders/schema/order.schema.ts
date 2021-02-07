import { OrderEntity } from "@commerce/orders";
import { ObjectType, PickType } from "@nestjs/graphql";

@ObjectType("OrderSchema")
export class OrderSchema extends OrderEntity{

}