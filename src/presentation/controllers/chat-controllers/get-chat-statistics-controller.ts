import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

export class GetChatStatisticsController implements Controller {
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

      const whereClause = scope.visibleUnitIds.length
        ? { unitStoreId: { in: scope.visibleUnitIds } }
        : undefined;

      // Estatísticas básicas
      const totalMessages = await prisma.chatMessage.count({
        where: whereClause,
      });

      const messagesWithImages = await prisma.chatMessage.count({
        where: {
          ...whereClause,
          imageBase64: { not: null },
        },
      });

      const messagesWithText = await prisma.chatMessage.count({
        where: {
          ...whereClause,
          text: { not: null },
        },
      });

      // Mensagens hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const messagesToday = await prisma.chatMessage.count({
        where: {
          ...whereClause,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      // Usuários únicos
      const uniqueSenders = await prisma.chatMessage.findMany({
        where: whereClause,
        select: { senderId: true },
        distinct: ["senderId"],
      });

      // Lojas com atividade
      const activeUnits = await prisma.chatMessage.findMany({
        where: whereClause,
        select: { unitStoreId: true },
        distinct: ["unitStoreId"],
      });

      // Última mensagem
      const lastMessage = await prisma.chatMessage.findFirst({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { name: true } },
          unitStore: { select: { name: true } },
        },
      });

      // Mensagens por hora (últimas 24h)
      const messagesByHour = [];
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date();
        hourStart.setHours(i, 0, 0, 0);
        const hourEnd = new Date();
        hourEnd.setHours(i + 1, 0, 0, 0);

        const count = await prisma.chatMessage.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: hourStart,
              lt: hourEnd,
            },
          },
        });

        messagesByHour.push({
          hour: i,
          count,
        });
      }

      return {
        statusCode: 200,
        body: {
          statistics: {
            totalMessages,
            messagesWithImages,
            messagesWithText,
            messagesToday,
            uniqueSenders: uniqueSenders.length,
            activeUnits: activeUnits.length,
            lastMessage: lastMessage
              ? {
                  id: lastMessage.id,
                  text: lastMessage.text,
                  sender: lastMessage.sender.name,
                  unit: lastMessage.unitStore.name,
                  createdAt: lastMessage.createdAt,
                }
              : null,
            messagesByHour,
          },
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Falha ao carregar estatísticas" },
      };
    }
  }
}
