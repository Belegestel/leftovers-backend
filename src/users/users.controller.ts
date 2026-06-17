import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Returns a list of users in the database." })
  @ApiOkResponse({
    description: "List of users: ID, name and email.",
    schema: {
      example: [
        { id: 1, name: "Bob Bobby", email: "bobbobby@example.com" },
        { id: 2, name: "Rob Robby", email: "robrobby@example.com" },
        { id: 3, name: "Tob Tobby", email: "tobtobby@example.com" },
      ],
    },
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
