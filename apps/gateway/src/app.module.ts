import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { Module } from "@nestjs/common";
import { config } from "@commerce/shared";

import { join } from "path";

import { GraphQLErrorFilter } from "./filters/graphql-exception.filter";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { OrdersModule } from "./orders/orders.module";
import { PaymentCardsModule } from "./payments/payment.module";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";

console.log('process.cwd()>>>!!!!!',join(__dirname,'../../../apps/gateway/src/**/*.gql'));

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [join(__dirname,'../../../apps/gateway/src/**/*.graphql')],
      fieldResolverEnhancers: ['interceptors'],
      installSubscriptionHandlers: true,
      // autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      path:'playground'
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    PaymentCardsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
