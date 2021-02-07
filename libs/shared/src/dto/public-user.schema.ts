import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class PublicUserSchema {
  @Field()
  id: string;

  @Field()
  name: string;
}