import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";
import type { AuthenticatedRequest } from "../types/authenticated-request.interface";
import { GetAllNotifs } from "./dto/getAllNotifs.dto";
import { AllNotificationsResponse } from "./dto/responses/allNotificationsResponse.dto";
import { MarkNotifAsRead } from "./dto/markNotifAsRead.dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "The notification list has been returned" })
  @Get()
  async getNotifs(
    @Req() req: AuthenticatedRequest,
  ): Promise<AllNotificationsResponse> {
    const input = GetAllNotifs.from(req.user.userId);
    const notifs = await this.service.getAllNotifs(input);
    return AllNotificationsResponse.from(notifs);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "The notification has been marked as read" })
  @Post(":id")
  async markNotifRead(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    const input = MarkNotifAsRead.from(id, req.user.userId);
    await this.service.markNotifAsRead(input);
  }
}
