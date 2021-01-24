import {
  Field,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { VariantEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
import { CreateVariantInput } from './create-variant.input';
@InputType()
@ObjectType()
export class UpdateVariantInput extends PartialType(CreateVariantInput){}
