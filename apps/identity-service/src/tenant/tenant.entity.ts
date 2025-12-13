import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityBase } from '@deigma/domain';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Tenant extends EntityBase {

  @Prop({
    required: true,
    default: () => 'active',
  })
  status: 'active' | 'inactive' | 'suspended';

  @Prop({ required: true })
  name: string;

}

export const TenantSchema = SchemaFactory.createForClass(Tenant);