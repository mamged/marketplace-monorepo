import {
  Field,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateRatingInput } from './create-rating.input';
@InputType()
@ObjectType()
export class UpdateRatingInput extends PartialType(CreateRatingInput) {}
