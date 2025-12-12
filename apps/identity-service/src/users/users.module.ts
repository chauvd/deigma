import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DtoMapper, DomainMapper } from '@deigma/mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    DtoMapper,
    DomainMapper
  ],
})
export class UsersModule { }
