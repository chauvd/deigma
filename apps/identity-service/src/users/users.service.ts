import { Inject, Injectable } from '@nestjs/common';
import { BaseEntityService } from '@deigma/domain';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService extends BaseEntityService<User, UserRepository> {

  constructor(
    repository: UserRepository,
    @Inject(CACHE_MANAGER) cache: Cache
  ) {
    super(repository, User.name, cache);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}
