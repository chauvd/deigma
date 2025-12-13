import { Injectable } from '@nestjs/common';
import { TenantBaseService, TenantContext } from '@deigma/domain';
import { TenantMembership } from './membership.entity';
import { TenantMembershipRepository } from './membership.repository';

@Injectable()
export class TenantMembershipService extends TenantBaseService<TenantMembership, TenantMembershipRepository> {

  constructor(repository: TenantMembershipRepository, tenantContext: TenantContext) {
    super(repository, tenantContext, TenantMembership.name);
  }

}
