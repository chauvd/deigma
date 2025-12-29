import { DtoSchema, Field } from "@deigma/mapper";
import z from "zod";

export const TenantMembershipDtoSchema = z.object({
  id: z.uuid(),
  tenantId: z.uuid(),
  userId: z.uuid(),
  roles: z.array(z.string()),
  isDefaultTenant: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

@DtoSchema(TenantMembershipDtoSchema)
export class TenantMembershipDto {

  @Field({ target: '_id' })
  id: string;

  @Field()
  tenantId: string;

  @Field()
  userId: string;

  @Field()
  roles: string[];

  @Field()
  isDefaultTenant: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

}
