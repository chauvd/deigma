import { ClientSession, Model } from 'mongoose';
import { EntityBase, EntityId, TenantEntityBase } from './entity.base';

export abstract class BaseRepository<T extends EntityBase> {

  protected constructor(protected readonly model: Model<T>) { }

  async create(data: Partial<T>): Promise<T> {
    const document = await this.model.create(data as any);
    return this.model.hydrate(document);
  }

  async findById(id: EntityId): Promise<T | null> {
    const leanDoc = await this.model.findById(id).lean().exec();
    return leanDoc ? this.model.hydrate(leanDoc) : null;
  }

  async findAll(): Promise<T[]> {
    const leanDocs = await this.model.find().lean().exec();
    return leanDocs.map(doc => this.model.hydrate(doc));
  }

  async update(
    id: EntityId,
    data: Partial<T>,
  ): Promise<T | null> {
    const leanDoc = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    return leanDoc ? this.model.hydrate(leanDoc) : null;
  }

  async delete(id: EntityId): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async exists(id: EntityId): Promise<boolean> {
    const exists = await this.model.exists({ _id: id });
    return exists !== null;
  }
}

export abstract class TenantBaseRepository<T extends TenantEntityBase> {
  protected constructor(protected readonly model: Model<T>) { }

  protected baseFilter(tenantId: EntityId, includeDeleted = false) {
    return {
      tenantId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    };
  }

  async create(
    tenantId: EntityId,
    data: Partial<T>,
    session?: ClientSession,
  ): Promise<T> {
    const documents = await this.model.create(
      [{ ...(data as any), tenantId }],
      { session },
    ) ?? [];

    const document = documents[0];

    return this.model.hydrate(document);
  }

  async findById(
    tenantId: EntityId,
    id: EntityId,
  ): Promise<T | null> {
    const leanDoc = await this.model
      .findOne({ _id: id, ...this.baseFilter(tenantId) })
      .lean()
      .exec();
    return leanDoc ? this.model.hydrate(leanDoc) : null;
  }

  async findAll(
    tenantId: EntityId,
  ): Promise<T[]> {
    return this.model
      .find(this.baseFilter(tenantId))
      .lean()
      .exec();
  }

  async update(
    tenantId: EntityId,
    id: EntityId,
    data: Partial<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    const leanDoc = await this.model
      .findOneAndUpdate(
        { _id: id, ...this.baseFilter(tenantId) },
        data,
        { new: true, session },
      )
      .lean()
      .exec();
    return leanDoc ? this.model.hydrate(leanDoc) : null;
  }

  async delete(
    tenantId: EntityId,
    id: EntityId,
    session?: ClientSession,
  ): Promise<void> {
    await this.model.deleteOne(
      { _id: id, ...this.baseFilter(tenantId) },
      { session },
    ).exec();
  }

  async exists(
    tenantId: EntityId,
    id: EntityId,
  ): Promise<boolean> {
    return (
      await this.model.exists({
        _id: id,
        ...this.baseFilter(tenantId),
      })
    ) !== null;
  }
}
