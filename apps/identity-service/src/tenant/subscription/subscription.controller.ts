import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { TenantSubscriptionService } from "./subscription.service";
import { DomainMapper, MapTo } from "@deigma/mapper";
import { TenantSubscription } from "./subscription.entity";
import { CreateTenantSubscriptionDto, TenantSubscriptionDto } from "@deigma/dtos";
import { AuthenticatedPrincipal, Principal } from "@deigma/authentication-core";

@Controller('tenants/:tenantId/subscriptions')
export class TenantSubscriptionsController {

  constructor(
    @Inject() private readonly mapper: DomainMapper,
    private readonly subscriptionsService: TenantSubscriptionService
  ) { }

  @Get()
  @MapTo(TenantSubscriptionDto)
  async findAll(
    @Principal() principal: AuthenticatedPrincipal,
    @Param('tenantId') tenantId: string
  ) {
    return this.subscriptionsService.findByTenantId(tenantId);
  }

  @Post()
  @MapTo(TenantSubscriptionDto)
  async create(
    @Principal() principal: AuthenticatedPrincipal,
    @Body() dto: CreateTenantSubscriptionDto
  ) {
    const payload = this.mapper.map(dto, TenantSubscription);
    return this.subscriptionsService.create(payload);
  }

  @Get(':subscriptionId')
  @MapTo(TenantSubscriptionDto)
  async findOne(
    @Principal() principal: AuthenticatedPrincipal,
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.subscriptionsService.findById(subscriptionId);
  }
}
