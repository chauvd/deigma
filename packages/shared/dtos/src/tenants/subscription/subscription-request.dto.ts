import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

export const CreateTenantSubscriptionDtoSchema = z.object({
  name: z.string().min(1).max(255),
});

@DtoSchema(CreateTenantSubscriptionDtoSchema)
export class CreateTenantSubscriptionDto {

  @Field()
  name: string;
}

export const UpdateTenantSubscriptionDtoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
});

@DtoSchema(UpdateTenantSubscriptionDtoSchema)
export class UpdateTenantSubscriptionDto {

  @Field()
  name?: string;
}