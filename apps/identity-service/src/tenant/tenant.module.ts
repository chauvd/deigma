import { Module } from '@nestjs/common';
import { TenantsService } from './tenant.service';
import { TenantsController } from './tenant.controller';
import { DtoMapper, DomainMapper } from '@deigma/mapper';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.entity';
import { TenantRepository } from './tenant.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema
      },
    ]),
  ],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    TenantRepository,
    DtoMapper,
    DomainMapper
  ],
})
export class TenantsModule { }
