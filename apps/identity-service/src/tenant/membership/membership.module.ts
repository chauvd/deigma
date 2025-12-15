import { TenantContext } from '@deigma/domain';
import { DtoMapper } from '@deigma/mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantMembershipsController } from './membership.controller';
import { TenantMembership, TenantMembershipSchema } from './membership.entity';
import { TenantMembershipRepository } from './membership.repository';
import { TenantMembershipService } from './membership.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TenantMembership.name,
        schema: TenantMembershipSchema
      },
    ]),
  ],
  controllers: [TenantMembershipsController],
  providers: [
    TenantMembershipService,
    TenantMembershipRepository,
    TenantContext,
    DtoMapper
  ],
})
export class TenantMembershipsModule { }
