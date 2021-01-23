import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class AuthTokenSchema {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  token: string;
}
