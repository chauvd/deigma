import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

export const CreateTenantDtoSchema = z.object({
  name: z.email()
});

@DtoSchema(CreateTenantDtoSchema)
export class CreateTenantDto {

  @Field()
  name: string;
}

export const UpdateTenantDtoSchema = z.object({
  name: z.string().optional(),
});

@DtoSchema(UpdateTenantDtoSchema)
export class UpdateTenantDto {

  @Field()
  name?: string;
}