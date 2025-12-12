import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityBase } from '@deigma/domain';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,       // Let Mongoose manage createdAt/updatedAt
  versionKey: false,
})
export class User extends EntityBase {

  @Prop({ required: true })
  familyName: string;

  @Prop({ required: true })
  givenName: string;

  @Prop({ required: true, unique: true })
  email: string
}

export const UserSchema = SchemaFactory.createForClass(User);