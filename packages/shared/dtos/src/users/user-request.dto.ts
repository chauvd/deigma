import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

@DtoSchema(
  z.object({
    email: z.email()
  })
)
export class CreateUserDto {

  @Field()
  email: string;
}

@DtoSchema(
  z.object({
    givenName: z.string(),
    familyName: z.string(),
  })
)
export class UpdateUserDto {

  @Field()
  status?: string;

  @Field()
  givenName?: string;

  @Field()
  familyName?: string;
}