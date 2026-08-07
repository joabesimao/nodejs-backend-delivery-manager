import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

export class LoadChatMessagesController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = Number(httpRequest.headers?.accountId || 0);

      if (!accountId) {
        return {
          statusCode: 401,
          body: { error: "Não autenticado" },
        };
      }

      const scope = await getAccountScope(prisma, accountId);

      if (!scope) {
        return {
          statusCode: 404,
          body: { error: "Conta não encontrada" },
        };
      }

      const limit = Number(httpRequest.query?.limit) || 100;
      const offset = Number(httpRequest.query?.offset) || 0;
      const unitStoreId = Number(httpRequest.query?.unitStoreId);

      let whereClause: any = {};

      // Filtrar por escopo visível
      if (scope.visibleUnitIds.length) {
        whereClause.unitStoreId = { in: scope.visibleUnitIds };
      }

      // Filtrar por loja específica se solicitado
      if (unitStoreId && scope.visibleUnitIds.includes(unitStoreId)) {
        whereClause.unitStoreId = unitStoreId;
      }

      const [messages, total] = await Promise.all([
        prisma.chatMessage.findMany({
          where: whereClause,
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
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.chatMessage.count({ where: whereClause }),
      ]);

      return {
        statusCode: 200,
        body: {
          messages: messages.reverse(),
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        },
      };
    } catch (error) {
      console.error("LoadChatMessagesController error:", error);
      return {
        statusCode: 500,
        body: { error: "Falha ao carregar mensagens", details: String(error) },
      };
    }
  }
}
