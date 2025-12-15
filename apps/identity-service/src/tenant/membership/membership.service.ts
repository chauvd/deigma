import { BaseTenantEntityService, TenantContext } from '@deigma/domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantMembership } from './membership.entity';
import { TenantMembershipRepository } from './membership.repository';

@Injectable()
export class TenantMembershipService extends BaseTenantEntityService<TenantMembership, TenantMembershipRepository> {

  constructor(repository: TenantMembershipRepository, tenantContext: TenantContext) {
    super(repository, tenantContext, TenantMembership.name);
  }

  async findByTenantAndUserId(tenantId: string, userId: string): Promise<TenantMembership> {
    const membership = await this.repository.findByTenantAndUserId(tenantId, userId);

    if (!membership) {
      throw new NotFoundException(`Membership not found for tenantId: ${tenantId} and userId: ${userId}`);
    }

    return membership;
  }

  async assign(tenantId: string, userIds: string[]): Promise<TenantMembership[]> {
    const tenantUuid = this.toUuid(tenantId);
    const memberships: TenantMembership[] = [];
    for (const userId of userIds) {
      const membership = new TenantMembership();
      membership.tenantId = tenantUuid;
      membership.userId = this.toUuid(userId);
      memberships.push(membership);
    }
    const assigned = await this.repository.createMany(memberships);
    if (assigned.length !== userIds.length) {
      throw new Error('Some memberships could not be assigned');
    }
    return assigned;
  }

  async unassign(memberships: TenantMembership[]): Promise<void> {
    await this.repository.deleteMany(memberships);
  }
}
