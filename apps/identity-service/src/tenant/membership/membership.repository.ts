import { TenantBaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TenantMembership } from './membership.entity';

@Injectable()
export class TenantMembershipRepository extends TenantBaseRepository<TenantMembership> {
  constructor(
    @InjectModel(TenantMembership.name)
    model: Model<TenantMembership>,
  ) {
    super(model);
  }
}
