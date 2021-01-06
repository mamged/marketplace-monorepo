import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, Min, IsInt, IsUUID, Validate } from "class-validator";


@InputType()
export class CreateOrder {
    @Min(1)
    @IsNotEmpty()
    @IsInt()
    @Field()
    quantity: number;
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
