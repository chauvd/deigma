import { DtoSchema, Field } from '@deigma/mapper';
import z from 'zod';

export const UserDtoSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  givenName: z.string(),
  familyName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

@DtoSchema(UserDtoSchema)
export class UserDto {
  @Field({ target: '_id' })
  id: string;

  @Field()
  status: string;

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