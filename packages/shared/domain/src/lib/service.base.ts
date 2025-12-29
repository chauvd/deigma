import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Types } from 'mongoose';
import ms from 'ms';
import { EntityBase, TenantEntityBase } from './entity.base';
import { BaseRepository, TenantBaseRepository } from './repository.base';
import { TenantContext } from './tenant';

export abstract class BaseEntityService<T extends EntityBase, R extends BaseRepository<T> = BaseRepository<T>> {
  protected constructor(
    protected readonly repository: R,
    protected readonly entityName: string,
    protected readonly cache?: Cache
  ) { }

  protected toUuid(id: string): Types.UUID {
    return new Types.UUID(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findById(id: string): Promise<T> {
    if (this.cache) {
      const cached = await this.cache.get<T>(`${this.entityName}:${id}`);
      if (cached) {
        return cached;
      }
    }

    const uuid = this.toUuid(id);

    const entity = await this.repository.findById(uuid);

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    if (this.cache) {
      await this.cache.set(`${this.entityName}:${id}`, entity, ms('1m'));
    }

    return entity;
  }

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const uuid = this.toUuid(id);

    const updated = await this.repository.update(
      uuid,
      data,
    );

    if (!updated) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    if (this.cache) {
      await this.cache.del(`${this.entityName}:${id}`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const uuid = this.toUuid(id);

    const exists = await this.repository.exists(uuid);

    if (!exists) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    await this.repository.delete(uuid);

    if (this.cache) {
      await this.cache.del(`${this.entityName}:${id}`);
    }
  }
}

export abstract class BaseTenantEntityService<T extends TenantEntityBase, R extends TenantBaseRepository<T> = TenantBaseRepository<T>> {
  protected constructor(
    protected readonly repository: R,
    protected readonly tenantContext: TenantContext,
    protected readonly entityName: string,
    protected readonly cache?: Cache
  ) { }

  protected get tenantId(): Types.UUID {
    return this.tenantContext.tenantId;
  }

  protected get tenantCacheKeyPrefix(): string {
    return `tenant:${this.tenantId.toString()}:${this.entityName}:`;
  }

  protected toUuid(id: string): Types.UUID {
    return new Types.UUID(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(this.tenantId, data);
  }

  async findById(id: string): Promise<T> {
    if (this.cache) {
      const cached = await this.cache.get<T>(`${this.tenantCacheKeyPrefix}:${id}`);
      if (cached) {
        return cached;
      }
    }

    const uuid = this.toUuid(id);

    const entity = await this.repository.findById(
      this.tenantId,
      uuid,
    );

    if (!entity) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    if (this.cache) {
      await this.cache.set(`${this.tenantCacheKeyPrefix}:${id}`, entity, ms('1m'));
    }

    return entity;
  }

  async findByTenantId(tenantId: string): Promise<T[]> {
    const uuid = this.toUuid(tenantId);
    return this.repository.findAll(uuid);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const uuid = this.toUuid(id);

    const updated = await this.repository.update(
      this.tenantId,
      uuid,
      data,
    );

    if (!updated) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    if (this.cache) {
      await this.cache.del(`${this.tenantCacheKeyPrefix}:${id}`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const uuid = this.toUuid(id);

    const exists = await this.repository.exists(this.tenantId, uuid);

    if (!exists) {
      throw new NotFoundException(
        `${this.entityName} ${id} not found`,
      );
    }

    await this.repository.delete(this.tenantId, uuid);

    if (this.cache) {
      await this.cache.del(`${this.tenantCacheKeyPrefix}:${id}`);
    }
  }
}