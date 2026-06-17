import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Returns a list of users in the database.' })
  @ApiResponse({ status: 200, description: 'List of users: ID, name and email.' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
