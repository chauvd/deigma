import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { TenantsService } from './tenant.service';
import { CreateTenantDto, TenantDto, UpdateTenantDto } from '@deigma/dtos';
import { DomainMapper, MapTo } from '@deigma/mapper';
import { Tenant } from './tenant.entity';

@Controller('tenants')
export class TenantsController {
  constructor(
    @Inject() private readonly mapper: DomainMapper,
    private readonly tenantsService: TenantsService
  ) { }

  @Post()
  @MapTo(TenantDto)
  async create(@Body() createTenantDto: CreateTenantDto) {
    const payload = this.mapper.map(createTenantDto, Tenant);
    return await this.tenantsService.create(payload);
  }

  @Get()
  @MapTo(TenantDto)
  async findAll() {
    return await this.tenantsService.findAll();
  }

  @Get(':id')
  @MapTo(TenantDto)
  async findOne(@Param('id') id: string) {
    return await this.tenantsService.findById(id);
  }

  @Patch(':id')
  @MapTo(TenantDto)
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    const payload = this.mapper.map(updateTenantDto, Tenant);
    return await this.tenantsService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tenantsService.delete(id);
  }
}
