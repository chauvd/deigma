import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { DomainMapper, MapTo } from "@deigma/mapper";
import { Subscription } from "./subscription.entity";
import { CreateSubscriptionDto, SubscriptionDto } from "@deigma/dtos";

@Controller('tenants/:tenantId/subscriptions')
export class SubscriptionsController {

  constructor(
    @Inject() private readonly mapper: DomainMapper,
    private readonly subscriptionsService: SubscriptionService
  ) { }

  @Get()
  @MapTo(SubscriptionDto)
  findAll(@Param('tenantId') tenantId: string) {
    return this.subscriptionsService.findByTenantId(tenantId);
  }

  @Post()
  @MapTo(SubscriptionDto)
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    const payload = this.mapper.map(dto, Subscription);
    return this.subscriptionsService.create(payload);
  }

  @Get(':subscriptionId')
  @MapTo(SubscriptionDto)
  findOne(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.subscriptionsService.findById(subscriptionId);
  }
}
