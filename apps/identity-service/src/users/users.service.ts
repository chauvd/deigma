import { Injectable } from '@nestjs/common';
import { BaseService } from '@deigma/domain';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService extends BaseService<User> {

  constructor(
    private readonly repo: UserRepository
  ) {
    super(repo, 'User');
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }
}
