import { DeleteChatMessage } from "../../../domain/usescases/chat/delete-chat-message";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, invalidMessageId, readAccountId, unauthenticated } from "./chat-http";

export class DeleteChatMessageController implements Controller {
  constructor(private readonly deleteChatMessage: DeleteChatMessage) {}

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

      await this.deleteChatMessage.delete(messageId, accountId);
      return ok({ success: true, message: "Mensagem deletada com sucesso" });
    } catch (error) {
      return mapDomainError(error) ?? chatError(500, "Falha ao deletar mensagem");
    }
  }
}
