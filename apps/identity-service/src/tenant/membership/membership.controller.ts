import { AssignTenantMembershipDto, AssignTenantMembershipDtoSchema, TenantMembershipDto, UnassignTenantMembershipDto, UnassignTenantMembershipDtoSchema } from "@deigma/dtos";
import { MapTo } from "@deigma/mapper";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TenantMembership } from "./membership.entity";
import { TenantMembershipService } from "./membership.service";

@Controller('tenants/:tenantId/memberships')
export class TenantMembershipsController {
  constructor(
    private readonly membershipsService: TenantMembershipService
  ) { }

  @Get()
  @MapTo(TenantMembershipDto)
  async findAll(@Param('tenantId') tenantId: string) {
    return this.membershipsService.findByTenantId(tenantId);
  }

  @Post()
  @MapTo(TenantMembershipDto)
  async assign(
    @Param('tenantId') tenantId: string,
    @Body() dto: AssignTenantMembershipDto
  ) {
    AssignTenantMembershipDtoSchema.parse(dto);
    return this.membershipsService.assign(tenantId, dto.userIds);
  }

  @Delete()
  async unassign(
    @Param('tenantId') tenantId: string,
    @Body() dto: UnassignTenantMembershipDto
  ) {
    UnassignTenantMembershipDtoSchema.parse(dto);
    const memberships: TenantMembership[] = [];
    for (const userId of dto.userIds) {
      const membership: TenantMembership = await this.membershipsService.findByTenantAndUserId(
        tenantId,
        userId
      );
      memberships.push(membership);
    }
    await this.membershipsService.unassign(memberships);
  }
}
