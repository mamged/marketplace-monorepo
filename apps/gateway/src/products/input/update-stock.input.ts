import {
  Field,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StockEntity } from '@commerce/products';
import { IsNotEmpty } from 'class-validator';
import { CreateStockInput } from './create-stock.input';
@InputType()
@ObjectType()
export class UpdateStockInput extends PartialType(
  CreateStockInput,
) {}
