import { DtoSchema, Field } from '@deigma/mapper';
import z from 'zod';

export const TenantSubscriptionDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

@DtoSchema(TenantSubscriptionDtoSchema)
export class TenantSubscriptionDto {

  @Field({ target: '_id' })
  id: string;

  @Field()
  status: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}