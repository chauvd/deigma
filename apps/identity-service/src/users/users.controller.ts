import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from '@deigma/dtos';
import { DomainMapper, MapTo } from '@deigma/mapper';
import { User } from './user.entity';

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
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @MapTo(UserDto)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  @MapTo(UserDto)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const payload = this.mapper.map(updateUserDto, User);
    return await this.usersService.update(id, payload);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
