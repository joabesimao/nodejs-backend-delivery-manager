import { LoadChatMessageById } from "../../../domain/usescases/chat/load-chat-message-by-id";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, invalidMessageId, readAccountId, unauthenticated } from "./chat-http";

export class LoadChatMessageByIdController implements Controller {
  constructor(private readonly loadChatMessageById: LoadChatMessageById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = readAccountId(httpRequest);
      const messageId = Number(httpRequest.params?.id || 0);

      if (!accountId) {
        return unauthenticated();
      }

      if (!messageId) {
        return invalidMessageId();
      }

      const message = await this.loadChatMessageById.loadById(messageId, accountId);
      return ok(message);
    } catch (error) {
      return mapDomainError(error) ?? chatError(500, "Falha ao carregar mensagem");
    }
  }
}
