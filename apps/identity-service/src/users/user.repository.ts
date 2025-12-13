import { BaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    model: Model<User>,
  ) {
    super(model);
  }

  // Domain-specific queries live here
  async findByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email }).lean().exec();
  }
}
