export interface IMapper<Entity = any, Dto = any> {
  // map an entity instance to a DTO object (validated)
  toDto?(entity: Entity): Promise<Dto> | Dto;

  // map an input DTO (already validated) to a partial entity suitable for create/update
  toEntity?(dto: Partial<Dto>): Promise<Partial<Entity>> | Partial<Entity>;
}
