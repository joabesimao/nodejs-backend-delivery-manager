import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

export class LoadChatMessageByIdController implements Controller {
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
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              unitStoreId: true,
            },
          },
          unitStore: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!message) {
        return {
          statusCode: 404,
          body: { error: "Mensagem não encontrada" },
        };
      }

      // Verificar permissão
      const scope = await getAccountScope(prisma, accountId);

      if (!scope || !scope.visibleUnitIds.includes(message.unitStoreId)) {
        return {
          statusCode: 403,
          body: { error: "Sem permissão para acessar essa mensagem" },
        };
      }

      return {
        statusCode: 200,
        body: message,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Falha ao carregar mensagem" },
      };
    }
  }
}
