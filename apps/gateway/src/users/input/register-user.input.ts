import { IsNotEmpty, MinLength, MaxLength, IsBoolean } from "class-validator";
import { LoginUserInput } from "./login-user.input";
import { InputType, Field } from "@nestjs/graphql";
import { AddressEntity } from "@commerce/users";
@InputType()
export class RegisterUserInput extends LoginUserInput {
    @MinLength(8)
    @MaxLength(32)
    @IsNotEmpty()
    @Field()
    name: string;

    @MinLength(8)
    @MaxLength(32)
    @IsNotEmpty()
    @Field()
    password_confirmation: string;
    @IsNotEmpty()
    @IsBoolean()
    @Field()
    seller: boolean;
}
