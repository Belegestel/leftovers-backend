import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check if the server is running.' })
  @ApiResponse({ status: 200, description: 'Server is running.' })
  @Get('health')
  getHealth(): string {
    return "OK";
  }
}
