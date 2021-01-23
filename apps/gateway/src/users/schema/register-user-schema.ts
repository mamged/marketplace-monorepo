import { AddressEntity, UserEntity } from '@commerce/users';
import { Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
@ObjectType()
export class RegisterUserSchema extends PickType(UserEntity, [
  'id',
  'name',
  'email',
  'seller',
]) {
  // export class RegisterUserInputSchema extends OmitType(UserEntity,["gateway_customer_id","hashPassword","password","recover","updated_at", "address"] as const) {
  // @Field(type=> AddressEntity, {nullable: true})
  // address: AddressEntity;
}
