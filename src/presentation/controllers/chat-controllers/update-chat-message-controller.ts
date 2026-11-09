import { UpdateChatMessage } from "../../../domain/usescases/chat/update-chat-message";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, invalidMessageId, readAccountId, unauthenticated } from "./chat-http";

export class UpdateChatMessageController implements Controller {
  constructor(private readonly updateChatMessage: UpdateChatMessage) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = readAccountId(httpRequest);
      const messageId = Number(httpRequest.params?.id || 0);
      const body = httpRequest.body || {};

      if (!accountId) {
        return unauthenticated();
      }

      if (!messageId) {
        return invalidMessageId();
      }

      const text = body.text ? String(body.text).trim() : null;

      if (text === "") {
        return chatError(400, "Texto da mensagem não pode estar vazio");
      }

      const message = await this.updateChatMessage.update({ messageId, accountId, text });
      return ok(message);
    } catch (error) {
      return mapDomainError(error) ?? chatError(500, "Falha ao atualizar mensagem");
    }
  }
}
