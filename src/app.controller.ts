import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Check if the server is running." })
  @ApiOkResponse({
    description: "Server is running.",
    example: "OK",
  })
  @Get("health")
  getHealth(): string {
    return "OK";
  }
}
