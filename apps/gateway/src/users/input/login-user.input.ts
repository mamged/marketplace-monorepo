import { IsNotEmpty, IsEmail, MinLength, MaxLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
@InputType()
export class LoginUserInput {
    @IsEmail()
    @IsNotEmpty()
    @Field()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    @Field()
    password: string;
}