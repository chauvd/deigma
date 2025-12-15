import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@deigma/domain';
import { Tenant } from './tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantsService extends BaseEntityService<Tenant, TenantRepository> {

  constructor(repository: TenantRepository) {
    super(repository, Tenant.name);
  }

}
