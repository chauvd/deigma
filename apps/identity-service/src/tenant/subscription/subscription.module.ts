import { DomainMapper, DtoMapper } from '@deigma/mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsController } from './subscription.controller';
import { Subscription, SubscriptionSchema } from './subscription.entity';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscription.name,
        schema: SubscriptionSchema
      },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionService,
    SubscriptionRepository,
    DtoMapper,
    DomainMapper
  ],
})
export class SubscriptionsModule { }
