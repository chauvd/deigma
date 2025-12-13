import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

@DtoSchema(
  z.object({
    name: z.email()
  })
)
export class CreateSubscriptionDto {

  @Field()
  name: string;
}

@DtoSchema(
  z.object({
    name: z.string(),
  })
)
export class UpdateSubscriptionDto {

  @Field()
  name?: string;
}