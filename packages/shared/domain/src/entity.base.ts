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
}