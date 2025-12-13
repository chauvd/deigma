import { Injectable } from '@nestjs/common';
import { BaseService } from '@deigma/domain';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService extends BaseService<User, UserRepository> {

  constructor(repository: UserRepository) {
    super(repository, User.name);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}
