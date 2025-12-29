import { AuthenticatedPrincipal, OidcJwtAuthGuard, Principal } from '@deigma/authentication-core';
import { CreateUserDto, UpdateUserDto, UserDto } from '@deigma/dtos';
import { DomainMapper, MapTo } from '@deigma/mapper';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(OidcJwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject() private readonly mapper: DomainMapper,
    private readonly usersService: UsersService
  ) { }

  @Post()
  @MapTo(UserDto)
  async create(@Body() createUserDto: CreateUserDto) {
    const payload = this.mapper.map(createUserDto, User);
    return await this.usersService.create(payload);
  }

  @Get()
  @MapTo(UserDto)
  async findAll(@Principal() principal: AuthenticatedPrincipal) {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @MapTo(UserDto)
  async findOne(
    @Principal() principal: AuthenticatedPrincipal, 
    @Param('id') id: string
  ) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  @MapTo(UserDto)
  async update(
    @Principal() principal: AuthenticatedPrincipal, 
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    const payload = this.mapper.map(updateUserDto, User);
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  async remove(
    @Principal() principal: AuthenticatedPrincipal,
    @Param('id') id: string
  ) {
    await this.usersService.delete(id);
  }
}
