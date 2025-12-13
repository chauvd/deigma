import { TenantEntityBase } from "@deigma/domain";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../users/user.entity";

export type TenantMembershipDocument = HydratedDocument<TenantMembership>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TenantMembership extends TenantEntityBase {

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.UUID;

  @Prop([String])
  roles: string[];

  @Prop()
  isDefaultTenant: boolean;

}

export const TenantMembershipSchema = SchemaFactory.createForClass(TenantMembership);

TenantMembershipSchema.index(
  { tenantId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null }
  }
);