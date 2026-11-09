import { LoadChatMessages } from "../../../domain/usescases/chat/load-chat-messages";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, readAccountId, unauthenticated } from "./chat-http";

export class LoadChatMessagesController implements Controller {
  constructor(private readonly loadChatMessages: LoadChatMessages) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = readAccountId(httpRequest);

      if (!accountId) {
        return unauthenticated();
      }

      const page = await this.loadChatMessages.load({
        accountId,
        limit: Number(httpRequest.query?.limit) || 100,
        offset: Number(httpRequest.query?.offset) || 0,
        unitStoreId: Number(httpRequest.query?.unitStoreId) || undefined,
      });

      return ok(page);
    } catch (error) {
      const domainResponse = mapDomainError(error);
      if (domainResponse) {
        return domainResponse;
      }
      console.error("LoadChatMessagesController error:", error);
      return chatError(500, "Falha ao carregar mensagens");
    }
  }
}
