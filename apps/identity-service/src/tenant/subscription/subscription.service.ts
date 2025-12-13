import { Injectable } from '@nestjs/common';
import { TenantBaseService, TenantContext } from '@deigma/domain';
import { Subscription } from './subscription.entity';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService extends TenantBaseService<Subscription, SubscriptionRepository> {

  constructor(repository: SubscriptionRepository, tenantContext: TenantContext) {
    super(repository, tenantContext, Subscription.name);
  }

}
