import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // En prod, à restreindre au domaine frontend
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connecté : ${client.id}`);
    // Ici, on pourrait extraire le Token JWT du handshake pour authentifier
    // const token = client.handshake.headers.authorization;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté : ${client.id}`);
  }

  /**
   * Permet à un client de rejoindre une "salle" spécifique (ex: sa classe, son école, ou son propre ID user).
   * @param room Nom de la salle
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room);
    this.logger.log(`Le client ${client.id} a rejoint la salle : ${room}`);
    return { event: 'joined', room };
  }

  /**
   * Envoie une notification à un utilisateur spécifique.
   * @param userId ID de l'utilisateur
   * @param payload Contenu de la notification
   */
  notifyUser(userId: string, payload: any) {
    this.server.to(`user_${userId}`).emit('notification', payload);
  }

  /**
   * Envoie une notification à toute une école.
   * @param schoolId ID de l'école
   * @param payload Contenu
   */
  notifySchool(schoolId: string, payload: any) {
    this.server.to(`school_${schoolId}`).emit('school_event', payload);
  }
}
