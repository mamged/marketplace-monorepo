import { Module, Scope } from "@nestjs/common";

import { CategoryResolver } from "./category.resolver";
import { CategoryService } from "./category.service";
import { UserDataLoader } from "../loaders/user.loader";
import { UserService } from "../users/user.service";
import { UsersModule } from "../users/users.module";

@Module({
    providers: [
        CategoryResolver,
        CategoryService,
        {
            inject: [CategoryService],
            useFactory: UserDataLoader.create,
            provide: UserDataLoader,
            scope: Scope.REQUEST
        }
    ],
    imports: [UsersModule],
    exports: [CategoryService]
})
export class CategoriesModule {}
