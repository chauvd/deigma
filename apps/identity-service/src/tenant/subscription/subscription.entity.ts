import { TenantEntityBase } from "@deigma/domain";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TenantSubscriptionDocument = HydratedDocument<TenantSubscription>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TenantSubscription extends TenantEntityBase {

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    default: () => 'active',
  })
  status: 'active' | 'paused' | 'withrdawn' | 'expired';

}

export const TenantSubscriptionSchema = SchemaFactory.createForClass(TenantSubscription);
