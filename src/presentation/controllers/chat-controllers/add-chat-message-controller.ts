import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";
import { emitChatRealtime } from "../../../main/realtime/realtime-state";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const estimateBase64Bytes = (base64Value: string): number => {
  const padding = base64Value.match(/=+$/)?.[0].length ?? 0;
  return Math.floor((base64Value.length * 3) / 4) - padding;
};

const normalizeBase64 = (imageBase64: string): string => {
  if (!imageBase64) {
    return "";
  }

  const marker = ",";
  const markerIndex = imageBase64.indexOf(marker);

  if (markerIndex >= 0 && imageBase64.startsWith("data:")) {
    return imageBase64.slice(markerIndex + 1);
  }

  return imageBase64;
};

export class AddChatMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = Number(httpRequest.headers?.accountId || 0);
      const body = httpRequest.body || {};

      if (!accountId) {
        return {
          statusCode: 401,
          body: { error: "Não autenticado" },
        };
      }

      // Validar payload
      const text = String(body.text || "").trim();
      const imageBase64 = body.imageBase64 ? String(body.imageBase64) : null;
      const imageMimeType = body.imageMimeType ? String(body.imageMimeType) : null;
      let unitStoreId = Number(body.unitStoreId || 0);

      if (!text && !imageBase64) {
        return {
          statusCode: 400,
          body: { error: "Mensagem não pode estar vazia" },
        };
      }

      // Verificar permissão e obter scope
      const scope = await getAccountScope(prisma, accountId);

      if (!scope) {
        return {
          statusCode: 404,
          body: { error: "Conta não encontrada" },
        };
      }

      // Se unitStoreId não foi fornecido, usar o primeiro da lista de visíveis
      if (!unitStoreId) {
        if (scope.visibleUnitIds.length === 0) {
          return {
            statusCode: 403,
            body: { error: "Sem permissão para enviar para nenhuma loja" },
          };
        }
        unitStoreId = scope.visibleUnitIds[0];
      }

      // Verificar se tem permissão para a loja específica
      if (!scope.visibleUnitIds.includes(unitStoreId)) {
        return {
          statusCode: 403,
          body: { error: "Sem permissão para enviar para essa loja" },
        };
      }

      // Validar tamanho da imagem
      if (imageBase64) {
        const normalizedBase64 = normalizeBase64(imageBase64);
        const sizeInBytes = estimateBase64Bytes(normalizedBase64);

        if (sizeInBytes > MAX_IMAGE_SIZE_BYTES) {
          return {
            statusCode: 400,
            body: {
              error: "Imagem excede o tamanho máximo de 5MB",
            },
          };
        }
      }

      // Salvar mensagem
      const message = await prisma.chatMessage.create({
        data: {
          unitStoreId,
          senderId: accountId,
          text: text || null,
          imageBase64: imageBase64 ? normalizeBase64(imageBase64) : null,
          imageMimeType: imageMimeType || null,
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

      emitChatRealtime("chat:message", scope.rootStoreId, message);

      return {
        statusCode: 201,
        body: message,
      };
    } catch (error) {
      console.error("[chat:add] error", error);
      return {
        statusCode: 500,
        body: { error: "Falha ao enviar mensagem" },
      };
    }
  }
}
