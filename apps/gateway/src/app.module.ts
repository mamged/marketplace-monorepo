import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from "@nestjs/core";
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
import { RolesGuard } from "./middlewares/roles.guard";
import { CategoriesModule } from "./categories/category.module";
@Module({
  imports: [
    GraphQLModule.forRoot({
      // typePaths: [join(__dirname,'../../../apps/gateway/src/**/*.graphql')],
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      context: ({ req }) => {
        return {
          ...req
        };
    },
    }),
    UsersModule,
    // ProductsModule,
    // OrdersModule,
    // PaymentCardsModule,
    CategoriesModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQLErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
