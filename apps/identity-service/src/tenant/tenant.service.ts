import { Injectable } from '@nestjs/common';
import { BaseService } from '@deigma/domain';
import { Tenant } from './tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantsService extends BaseService<Tenant, TenantRepository> {

  constructor(repository: TenantRepository) {
    super(repository, Tenant.name);
  }

}
