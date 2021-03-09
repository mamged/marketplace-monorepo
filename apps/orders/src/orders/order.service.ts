import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDTO } from '@commerce/shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orders: Repository<OrderEntity>,
  ) {}
  async get(user_id: string): Promise<OrderEntity[]> {
    return this.orders.find({ user_id });
  }
  async markOrderStatus(id, status) {
    return this.orders.update(id, {
      status,
    });
  }
  async findByIdAndUserId(id, user_id) {
    return this.orders.findOneOrFail({ id, user_id });
  }
  async create({ products, user_id }: OrderDTO): Promise<OrderEntity> {
    // console.log('!!!products!!!', products);
    const INITIAL_VALUE = 0;
    const total_price = products.reduce(
      (accumulator, Orderedproduct) =>
        accumulator + Orderedproduct.quantity * Orderedproduct.product.price,
      INITIAL_VALUE,
    );
    const databaseProducts = products.map((Orderedproduct) => {
      //add price to the order to avoid price changes by seller in the future after order placed
      return { id: Orderedproduct.product.id, quantity: Orderedproduct.quantity, price: Orderedproduct.product.price };
    });
    // const actualProducts = products.map((Orderedproduct) => {
    //   Orderedproduct.quantity = Orderedproduct.quantity - Orderedproduct.quantity;
    //   delete Orderedproduct.quantity;
    //   return { ...Orderedproduct.product };
    // });

    const order = await this.orders.create({
      products: databaseProducts,
      user_id,
      total_price,
    });
    await this.orders.save(order);
    
    
    // console.log('!!!databaseProducts!!!',databaseProducts)
    // const returnedVal = {...order, products};
    order.products = products;
    console.log('!!!order!!!', order);
    return order;
  }
  async destroy({ id, user_id }) {
    // find the order.
    const order = await this.orders.findOneOrFail({
      where: { id, user_id },
    });
    await this.orders.delete({ id, user_id });
    // return the order to fire an event increasing the stock of related products to this order at the gateway.
    return order;
  }
}
