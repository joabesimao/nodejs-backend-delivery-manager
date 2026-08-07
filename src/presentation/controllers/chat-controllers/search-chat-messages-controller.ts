import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

export class SearchChatMessagesController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = Number(httpRequest.headers?.accountId || 0);
      const query = httpRequest.query || {};

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

      // Parâmetros de busca
      const searchText = String(query.q || "").trim();
      const unitStoreId = Number(query.unitStoreId || 0);
      const senderId = Number(query.senderId || 0);
      const limit = Math.min(Number(query.limit) || 50, 100);
      const offset = Number(query.offset) || 0;
      const dateFrom = query.dateFrom ? new Date(String(query.dateFrom)) : null;
      const dateTo = query.dateTo ? new Date(String(query.dateTo)) : null;
      const hasImage = query.hasImage === "true";
      const hasText = query.hasText === "true";

      let whereClause: any = {};

      // Filtrar por escopo visível
      if (scope.visibleUnitIds.length) {
        whereClause.unitStoreId = { in: scope.visibleUnitIds };
      }

      // Filtrar por loja específica
      if (unitStoreId && scope.visibleUnitIds.includes(unitStoreId)) {
        whereClause.unitStoreId = unitStoreId;
      }

      // Filtrar por remetente
      if (senderId) {
        whereClause.senderId = senderId;
      }

      // Filtrar por intervalo de data
      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) {
          whereClause.createdAt.gte = dateFrom;
        }
        if (dateTo) {
          const endOfDay = new Date(dateTo);
          endOfDay.setHours(23, 59, 59, 999);
          whereClause.createdAt.lte = endOfDay;
        }
      }

      // Filtrar por tipo de conteúdo
      if (hasImage) {
        whereClause.imageBase64 = { not: null };
      }
      if (hasText) {
        whereClause.text = { not: null };
      }

      // Buscar por texto
      if (searchText) {
        whereClause.OR = [
          { text: { contains: searchText } },
          { sender: { name: { contains: searchText } } },
          { unitStore: { name: { contains: searchText } } },
        ];
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
      return {
        statusCode: 500,
        body: { error: "Falha ao buscar mensagens" },
      };
    }
  }
}
