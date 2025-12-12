import { DtoSchema } from '@deigma/mapper';
import { Field } from 'packages/shared/mapper/src/field.decorator';
import z from 'zod';

@DtoSchema(
  z.object({
    id: z.string(),
    email: z.email(),
    givenName: z.string(),
    familyName: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
)
export class UserDto {
  @Field({ target: '_id' })
  id: string;

  @Field()
  givenName: string;

  @Field()
  familyName: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}