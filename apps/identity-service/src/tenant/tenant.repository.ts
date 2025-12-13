import { BaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantRepository extends BaseRepository<Tenant> {
  constructor(
    @InjectModel(Tenant.name)
    model: Model<Tenant>,
  ) {
    super(model);
  }
}
