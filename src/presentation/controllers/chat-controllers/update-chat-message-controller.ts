import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";

export class UpdateChatMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = Number(httpRequest.headers?.accountId || 0);
      const messageId = Number(httpRequest.params?.id || 0);
      const body = httpRequest.body || {};

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

      // Validar payload
      const text = body.text ? String(body.text).trim() : null;

      if (text === "") {
        return {
          statusCode: 400,
          body: { error: "Texto da mensagem não pode estar vazio" },
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

      // Verificar permissão: somente remetente ou admin podem editar
      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: { role: true },
      });

      const isOwner = message.senderId === accountId;
      const isAdmin = account?.role === "admin";

      if (!isOwner && !isAdmin) {
        return {
          statusCode: 403,
          body: { error: "Sem permissão para editar esta mensagem" },
        };
      }

      // Se não tem imagem e quer remover texto, erro
      if (!text && !message.imageBase64) {
        return {
          statusCode: 400,
          body: { error: "Mensagem não pode ficar vazia" },
        };
      }

      // Atualizar mensagem
      const updatedMessage = await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          text,
        },
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

      return {
        statusCode: 200,
        body: updatedMessage,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: { error: "Falha ao atualizar mensagem" },
      };
    }
  }
}
