import { DtoSchema } from "@deigma/mapper";
import { Field } from "packages/shared/mapper/src/field.decorator";
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
  givenName?: string;

  @Field()
  familyName?: string;
}