import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DtoMapper, DomainMapper } from '@deigma/mapper';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    DtoMapper,
    DomainMapper
  ],
})
export class UsersModule { }
