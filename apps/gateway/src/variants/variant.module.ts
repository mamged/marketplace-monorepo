import { Module, Scope } from '@nestjs/common';

import { VariantResolver } from './variant.resolver';
import { VariantService } from './variant.service';
import { UserDataLoader } from '../loaders/user.loader';
import { UserService } from '../users/user.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    VariantResolver,
    VariantService,
    {
      inject: [UserService],
      useFactory: UserDataLoader.create,
      provide: UserDataLoader,
      scope: Scope.REQUEST,
    },
  ],
  imports: [UsersModule],
  exports: [VariantService],
})
export class VariantsModule {}
