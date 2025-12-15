import { DomainMapper, DtoMapper } from '@deigma/mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSubscriptionsController } from './subscription.controller';
import { TenantSubscription, TenantSubscriptionSchema } from './subscription.entity';
import { TenantSubscriptionRepository } from './subscription.repository';
import { TenantSubscriptionService } from './subscription.service';
import { TenantContext } from '@deigma/domain';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TenantSubscription.name,
        schema: TenantSubscriptionSchema
      },
    ]),
  ],
  controllers: [TenantSubscriptionsController],
  providers: [
    TenantSubscriptionService,
    TenantSubscriptionRepository,
    TenantContext,
    DtoMapper,
    DomainMapper
  ],
})
export class TenantSubscriptionsModule { }
