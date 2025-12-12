import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@deigma/dtos';
import { DomainMapper } from '@deigma/mapper';
import { EntityId, PagedResult } from '@deigma/domain';
import { User } from './user.entity';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @Inject() private readonly mapper: DomainMapper,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const payload = this.mapper.map(createUserDto, User);
    return payload;
  }

  async findAll(): Promise<PagedResult<User>> {
    return new PagedResult([], 0);
  }

  async findOne(id: EntityId): Promise<User> {
    return {
      _id: new Types.UUID(),
      email: 'sample@gmail.com',
      givenName: 'Sample',
      familyName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  async update(id: EntityId, updateUserDto: UpdateUserDto): Promise<User> {
    const payload = this.mapper.map(updateUserDto, User);
    return payload;
  }

  async remove(id: EntityId): Promise<void> {
    return;
  }
}
