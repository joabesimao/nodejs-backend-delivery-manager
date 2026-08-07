import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

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
      console.log("1. Handler iniciado");
      const accountId = Number(httpRequest.headers?.accountId || 0);
      console.log("2. AccountId:", accountId);
      const body = httpRequest.body || {};

      if (!accountId) {
        console.log("3. AccountId vazio, retornando 401");
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

      console.log("4. Payload validado - text:", text, "imageBase64:", !!imageBase64, "unitStoreId:", unitStoreId);

      if (!text && !imageBase64) {
        return {
          statusCode: 400,
          body: { error: "Mensagem não pode estar vazia" },
        };
      }

      // Verificar permissão e obter scope
      console.log("5. Verificando scope da conta...");
      const scope = await getAccountScope(prisma, accountId);
      console.log("6. Scope:", scope);

      if (!scope) {
        return {
          statusCode: 404,
          body: { error: "Conta não encontrada" },
        };
      }

      // Se unitStoreId não foi fornecido, usar o primeiro da lista de visíveis
      if (!unitStoreId) {
        console.log("7. unitStoreId não fornecido, visibleUnitIds:", scope.visibleUnitIds);
        if (scope.visibleUnitIds.length === 0) {
          console.log("8. Sem unitStore visível, retornando 403");
          return {
            statusCode: 403,
            body: { error: "Sem permissão para enviar para nenhuma loja" },
          };
        }
        unitStoreId = scope.visibleUnitIds[0];
        console.log("9. unitStoreId definido como:", unitStoreId);
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
      console.log("10. Criando mensagem...");
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

      console.log("11. Mensagem criada:", message.id);
      return {
        statusCode: 201,
        body: message,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("AddChatMessageController error:", errorMessage, error);
      return {
        statusCode: 500,
        body: { error: errorMessage || "Falha ao enviar mensagem" },
      };
    }
  }
}
