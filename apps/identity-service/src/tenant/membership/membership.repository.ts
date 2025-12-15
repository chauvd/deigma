import { TenantBaseRepository } from '@deigma/domain';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { TenantMembership } from './membership.entity';

@Injectable()
export class TenantMembershipRepository extends TenantBaseRepository<TenantMembership> {
  constructor(
    @InjectModel(TenantMembership.name)
    model: Model<TenantMembership>,
  ) {
    super(model);
  }

  async createMany(memberships: TenantMembership[]): Promise<TenantMembership[]> {
    // Use insertMany for batch insert; wrap in transaction if needed for atomicity
    const session: ClientSession = await this.model.db.startSession();
    session.startTransaction();
    try {
      const inserted = await this.model.insertMany(memberships, { session });
      await session.commitTransaction();
      return inserted;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findByTenantAndUserId(tenantId: string, userId: string): Promise<TenantMembership | null> {
    return this.model.findOne({ tenantId, userId }).exec();
  }

  async deleteMany(memberships: TenantMembership[]): Promise<void> {
    const session: ClientSession = await this.model.db.startSession();
    session.startTransaction();
    try {
      const ids = memberships.map(m => m._id);
      await this.model.deleteMany({ _id: { $in: ids } }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

}
