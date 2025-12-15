import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

export const CreateUserDtoSchema = z.object({
  email: z.email()
});

@DtoSchema(CreateUserDtoSchema)
export class CreateUserDto {

  @Field()
  email: string;
}

export const UpdateUserDtoSchema = z.object({
  status: z.string().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
});

@DtoSchema(UpdateUserDtoSchema)
export class UpdateUserDto {

  @Field()
  status?: string;

  @Field()
  givenName?: string;

  @Field()
  familyName?: string;
}