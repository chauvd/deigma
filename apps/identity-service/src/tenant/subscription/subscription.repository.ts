import { TenantBaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionRepository extends TenantBaseRepository<Subscription> {
  constructor(
    @InjectModel(Subscription.name)
    model: Model<Subscription>,
  ) {
    super(model);
  }
}
