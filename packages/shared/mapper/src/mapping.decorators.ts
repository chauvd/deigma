import 'reflect-metadata';

export const MAP_FIELDS = Symbol('map_fields');
export const DTO_SCHEMA = Symbol('dto_schema');
export const MAP_TO_ENTITY_FIELDS = Symbol('map_to_entity_fields');

export interface FieldMapping {
  targetKey: string; // property key on DTO
  sourceKey?: string; // property key on entity
  providerToken?: any; // injectable provider token for computed values
  providerMethod?: string; // method name on provider
}

export interface ToEntityMapping {
  dtoKey: string; // property key on DTO
  entityKey?: string; // property key on entity
}

export function MapFrom(sourceKey: string) {
  return (target: any, propertyKey: string) => {
    const existing: FieldMapping[] = Reflect.getMetadata(MAP_FIELDS, target.constructor) || [];

    existing.push({
      targetKey: propertyKey,
      sourceKey,
    });

    Reflect.defineMetadata(MAP_FIELDS, existing, target.constructor);
  };
}

export function MapComputed(providerToken: any, providerMethod: string) {
  return (target: any, propertyKey: string) => {
    const existing: FieldMapping[] = Reflect.getMetadata(MAP_FIELDS, target.constructor) || [];

    existing.push({
      targetKey: propertyKey,
      providerToken,
      providerMethod,
    });

    Reflect.defineMetadata(MAP_FIELDS, existing, target.constructor);
  };
}

export function MapToEntity(entityKey?: string) {
  return (target: any, propertyKey: string) => {
    const existing: ToEntityMapping[] = Reflect.getMetadata(MAP_TO_ENTITY_FIELDS, target.constructor) || [];

    existing.push({
      dtoKey: propertyKey,
      entityKey: entityKey ?? propertyKey,
    });

    Reflect.defineMetadata(MAP_TO_ENTITY_FIELDS, existing, target.constructor);
  };
}

export function DtoSchema(schema: any) {
  return (target: any) => {
    Reflect.defineMetadata(DTO_SCHEMA, schema, target);
  };
}

export const MappingMetadata = { MAP_FIELDS, DTO_SCHEMA, MAP_TO_ENTITY_FIELDS };