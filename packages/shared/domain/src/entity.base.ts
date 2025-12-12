import { ObjectId } from 'mongoose';

export abstract class EntityBase {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}