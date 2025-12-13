import { DtoSchema, Field } from '@deigma/mapper';
import z from 'zod';

@DtoSchema(
  z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
)
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