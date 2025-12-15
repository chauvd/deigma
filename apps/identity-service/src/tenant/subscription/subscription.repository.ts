import { TenantBaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantSubscription } from './subscription.entity';

@Injectable()
export class TenantSubscriptionRepository extends TenantBaseRepository<TenantSubscription> {
  constructor(
    @InjectModel(TenantSubscription.name)
    model: Model<TenantSubscription>,
  ) {
    super(model);
  }
}
