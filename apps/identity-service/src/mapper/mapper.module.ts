import { Module } from '@nestjs/common';
import { DtoMapper, DomainMapper, DtoMapperInterceptor } from '@deigma/mapper';

@Module({
  providers: [
    DtoMapper,
    DomainMapper,
    DtoMapperInterceptor
  ],
  exports: [
    DtoMapper,
    DomainMapper
  ],
})
export class MappersModule { }