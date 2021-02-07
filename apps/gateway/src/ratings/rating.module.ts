import { Module, Scope } from '@nestjs/common';

import { RatingResolver } from './rating.resolver';
import { RatingService } from './rating.service';
import { UserDataLoader } from '../loaders/user.loader';
import { UserService } from '../users/user.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    RatingResolver,
    RatingService,
    {
      inject: [UserService],
      useFactory: UserDataLoader.create,
      provide: UserDataLoader,
      scope: Scope.REQUEST,
    },
  ],
  imports: [UsersModule],
  exports: [RatingService],
})
export class RatingsModule {}
