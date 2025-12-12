import 'reflect-metadata';

export const METADATA_FIELDS = Symbol('mapping_fields');

export interface FieldOptions {
  /**
   * Skip this field entirely during mapping (both directions).
   */
  ignore?: boolean;

  /**
   * Target field name on the object when mapping
   * Example: target: "_id" maps entity._id → dto.id
   */
  target?: string;

  /**
   * Computed value for the field.
   * Inline function OR provider-based function.
   */
  computed?:
  | ((source: any) => any)
  | { provider: any; method: string };
}


export function Field(options: FieldOptions = {}) {
  return (target: any, propertyKey: string) => {
    const existing = Reflect.getMetadata(METADATA_FIELDS, target.constructor) ?? {};

    existing[propertyKey] = options;

    Reflect.defineMetadata(METADATA_FIELDS, existing, target.constructor);
  };
}

export function getFieldMetadata(dtoClass: any): Record<string, FieldOptions> {
  return Reflect.getMetadata(METADATA_FIELDS, dtoClass) ?? {};
}
