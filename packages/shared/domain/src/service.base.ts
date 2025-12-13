import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { EntityBase, TenantEntityBase } from './entity.base';
import { BaseRepository, TenantBaseRepository } from './repository.base';
import { TenantContext } from './tenant';

export abstract class BaseService<T extends EntityBase, R extends BaseRepository<T> = BaseRepository<T>> {

  protected constructor(
    protected readonly repository: R,
    protected readonly entityName: string,
  ) { }

  protected toUuid(id: string): Types.UUID {
    return new Types.UUID(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(this.toUuid(id));

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    return entity;
  }

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updated = await this.repository.update(
      this.toUuid(id),
      data,
    );

    if (!updated) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.repository.exists(this.toUuid(id));

    if (!exists) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    await this.repository.delete(this.toUuid(id));
  }
}

export abstract class TenantBaseService<T extends TenantEntityBase, R extends TenantBaseRepository<T> = TenantBaseRepository<T>> {
  protected constructor(
    protected readonly repository: R,
    protected readonly tenantContext: TenantContext,
    protected readonly entityName: string,
  ) { }

  protected get tenantId(): Types.UUID {
    return this.tenantContext.tenantId;
  }

  protected toUuid(id: string): Types.UUID {
    return new Types.UUID(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(this.tenantId, data);
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(
      this.tenantId,
      this.toUuid(id),
    );

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    return entity;
  }

  async findByTenantId(tenantId: string): Promise<T[]> {
    return this.repository.findAll(
      this.toUuid(tenantId),
    );
  }
}