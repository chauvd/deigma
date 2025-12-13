import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type EntityId = string | Types.UUID;

export abstract class EntityBase {
  @Prop({
    type: Types.UUID,
    required: true,
    default: () => new Types.UUID(),
  })
  _id: Types.UUID;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null, index: true })
  deletedAt: Date | null;
}

export abstract class TenantEntityBase extends EntityBase {

  @Prop({ required: true, index: true })
  tenantId: Types.UUID;
}