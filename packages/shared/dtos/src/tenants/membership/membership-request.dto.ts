import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

export const AssignTenantMembershipDtoSchema = z.object({
  userIds: z.array(z.uuid()),
});

@DtoSchema(AssignTenantMembershipDtoSchema)
export class AssignTenantMembershipDto {

  @Field()
  userIds: string[];
}

export const UnassignTenantMembershipDtoSchema = z.object({
  userIds: z.array(z.uuid()),
});

@DtoSchema(UnassignTenantMembershipDtoSchema)
export class UnassignTenantMembershipDto {

  @Field()
  userIds: string[];
}