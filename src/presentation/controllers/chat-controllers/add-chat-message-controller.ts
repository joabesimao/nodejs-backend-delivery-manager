import { AddChatMessage } from "../../../domain/usescases/chat/add-chat-message";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, readAccountId, unauthenticated } from "./chat-http";

export class AddChatMessageController implements Controller {
  constructor(private readonly addChatMessage: AddChatMessage) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = readAccountId(httpRequest);
      const body = httpRequest.body || {};

      if (!accountId) {
        return unauthenticated();
      }

      const text = String(body.text || "").trim();
      const imageBase64 = body.imageBase64 ? String(body.imageBase64) : null;
      const imageMimeType = body.imageMimeType ? String(body.imageMimeType) : null;

      if (!text && !imageBase64) {
        return chatError(400, "Mensagem não pode estar vazia");
      }

      const message = await this.addChatMessage.add({
        accountId,
        unitStoreId: Number(body.unitStoreId || 0),
        text: text || null,
        imageBase64,
        imageMimeType,
      });

      return {
        statusCode: 201,
        body: message,
      };
    } catch (error) {
      const domainResponse = mapDomainError(error);
      if (domainResponse) {
        return domainResponse;
      }
      console.error("[chat:add] error", error);
      return chatError(500, "Falha ao enviar mensagem");
    }
  }
}
