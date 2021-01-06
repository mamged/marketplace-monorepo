import { Client, ClientProxy, Transport } from "@nestjs/microservices";
import {
    Resolver,
    Context,
    Mutation,
    Args,
    Query,
    ResolveField,
    Parent,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { config, ProductDTO, OrderDTO, UserDTO, ProductOrder } from "@commerce/shared";
import { UserEntity } from "@commerce/users";
import { ProductEntity } from "@commerce/products";
import { OrderEntity } from "@commerce/orders";
import { AuthGuard } from "../middlewares/auth.guard";
import { CreateOrder } from "./create-order.validation";
import { OrderProductDataLoader } from "../loaders/order-product.loader";
import { OrderService } from "./order.service";
import { UUID } from "../shared/validation/uuid.validation";
import { UserDataLoader } from "../loaders/user.loader";

@Resolver("Order")
export class OrderResolver {
    @Client({
        transport: Transport.REDIS,
        options: {
            url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
        }
    })
    private client: ClientProxy;

    constructor(
        private readonly orderService: OrderService,
        private readonly usersDataLoader: UserDataLoader,
        private readonly orderProductLoader: OrderProductDataLoader
    ) {}
    @ResolveField("user", () => UserEntity)
    async user(@Parent() order: OrderDTO): Promise<UserDTO> {
        return this.usersDataLoader.load(order.user.id.toString());
    }
    @ResolveField("products", () => [ProductEntity])
    async products(@Parent() order: OrderEntity): Promise<ProductDTO[]> {
        return this.orderProductLoader.loadMany(order.products);
    }
    @Query(returns=> OrderEntity)
    @UseGuards(new AuthGuard())
    orders(@Context("user") user: any): Promise<OrderDTO[]> {
        return this.orderService.indexOrdersByUser(user.id);
    }
    @Mutation(returns=> OrderEntity)
    @UseGuards(new AuthGuard())
    deleteOrder(@Args("order") { id }: UUID, @Context("user") user: any) {
        return this.orderService.destroyUserOrder(id, user.id);
    }
    @Mutation(returns=> [CreateOrder])
    @UseGuards(new AuthGuard())
    createOrder(
        @Args("products") products: CreateOrder[],
        @Context("user") user: any
    ): Promise<ProductDTO> {
        return new Promise((resolve, reject) => {
            // fetch products user is trying to purchase to check on the quantity.
            this.client
                .send<ProductOrder[]>(
                    "fetch-products-by-ids",
                    products.map(product => product.id)
                )
                .subscribe(
                    async fetchedProducts => {
                        const filteredProducts = products.filter(product => {
                            const p: ProductOrder = fetchedProducts.find(
                                p => p.product.id === product.id
                            );
                            return p.quantity >= product.quantity;
                        });
                        // there is something wrong with the quantity of passed products.
                        if (filteredProducts.length != products.length) {
                            return reject(
                                "Products are out of stock at the moment, try with lower stock."
                            );
                        }
                        return resolve(
                            await this.orderService.store(
                                products,
                                user.id,
                                fetchedProducts
                            )
                        );
                    },
                    error => reject(error)
                );
        });
    }
}
