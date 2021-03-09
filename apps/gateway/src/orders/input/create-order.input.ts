import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Min, IsInt, IsUUID, Validate } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Min(1)
  @IsNotEmpty()
  @IsInt()
  @Field()
  quantity: number;
  @IsUUID()
  @IsNotEmpty()
  @Field({description: "this suppose to be variant Id"})
  id: string;
}
