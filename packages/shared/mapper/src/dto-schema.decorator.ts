import 'reflect-metadata';

export const DTO_SCHEMA = Symbol('dto_schema');

export function DtoSchema(schema: any) {
  return (target: any) => {
    Reflect.defineMetadata(DTO_SCHEMA, schema, target);
  };
}

export const MappingMetadata = { DTO_SCHEMA };