import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { NotificationModel } from "./notification.model";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly clients = new Map<number, Socket>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const token = socket.handshake.auth.token;

      const payload = await this.jwtService.verifyAsync(token);

      this.clients.set(payload.userId, socket);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    for (const [userId, client] of this.clients) {
      if (client.id === socket.id) {
        this.clients.delete(userId);
        break;
      }
    }
  }

  notifyUser(userId: number, notification: NotificationModel) {
    this.clients.get(userId)?.emit("notification", notification);
  }
}
