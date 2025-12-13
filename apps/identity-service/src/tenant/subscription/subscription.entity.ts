import { TenantEntityBase } from "@deigma/domain";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Subscription extends TenantEntityBase {

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    default: () => 'active',
  })
  status: 'active' | 'paused' | 'withrdawn' | 'expired';

}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
