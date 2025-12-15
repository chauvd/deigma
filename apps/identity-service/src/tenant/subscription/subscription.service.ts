import { Injectable } from '@nestjs/common';
import { BaseTenantEntityService, TenantContext } from '@deigma/domain';
import { TenantSubscription } from './subscription.entity';
import { TenantSubscriptionRepository } from './subscription.repository';

@Injectable()
export class TenantSubscriptionService extends BaseTenantEntityService<TenantSubscription, TenantSubscriptionRepository> {

  constructor(repository: TenantSubscriptionRepository, tenantContext: TenantContext) {
    super(repository, tenantContext, TenantSubscription.name);
  }

}
