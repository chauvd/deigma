import { DtoSchema, Field } from '@deigma/mapper';
import z from 'zod';

export const TenantDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

@DtoSchema(TenantDtoSchema)
export class TenantDto {
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