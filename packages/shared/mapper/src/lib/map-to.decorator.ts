import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { DtoMapperInterceptor } from './mapper.interceptor';

export const MAP_DTO_KEY = 'map_dto';

export function MapTo(dtoClass: any) {
  return applyDecorators(SetMetadata(MAP_DTO_KEY, dtoClass), UseInterceptors(DtoMapperInterceptor));
}