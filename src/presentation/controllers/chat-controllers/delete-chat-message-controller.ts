import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";
import { emitChatRealtime } from "../../../main/realtime/realtime-state";

export class DeleteChatMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = Number(httpRequest.headers?.accountId || 0);
      const messageId = Number(httpRequest.params?.id || 0);

      if (!accountId) {
        return {
          statusCode: 401,
          body: { error: "Não autenticado" },
        };
      }

      if (!messageId) {
        return {
          statusCode: 400,
          body: { error: "ID de mensagem inválido" },
        };
      }

      // Buscar mensagem
      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: {
          sender: {
            select: { id: true, role: true },
          },
        },
      });

      if (!message) {
        return {
          statusCode: 404,
          body: { error: "Mensagem não encontrada" },
        };
      }

      // Verificar permissão: somente remetente ou admin podem deletar
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { role: true },
      });

      const isOwner = message.senderId === accountId;
      const isAdmin = account?.role === "admin";

      const scope = await getAccountScope(prisma, accountId);
      const outOfScope =
        !!scope &&
        scope.visibleUnitIds.length > 0 &&
        !scope.visibleUnitIds.includes(message.unitStoreId);

      if ((!isOwner && !isAdmin) || outOfScope) {
        return {
          statusCode: 403,
          body: { error: "Sem permissão para deletar esta mensagem" },
        };
      }

      // Deletar mensagem
      await prisma.chatMessage.delete({
        where: { id: messageId },
      });

      emitChatRealtime("chat:message-deleted", scope?.rootStoreId ?? null, {
        messageId,
      });

      return {
        statusCode: 200,
        body: { success: true, message: "Mensagem deletada com sucesso" },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Falha ao deletar mensagem" },
      };
    }
  }
}
