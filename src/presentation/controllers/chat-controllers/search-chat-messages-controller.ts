import { SearchChatMessages } from "../../../domain/usescases/chat/search-chat-messages";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, readOptionalAccountId } from "./chat-http";

export class SearchChatMessagesController implements Controller {
  constructor(private readonly searchChatMessages: SearchChatMessages) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const query = httpRequest.query || {};

      const page = await this.searchChatMessages.search({
        accountId: readOptionalAccountId(httpRequest),
        searchText: String(query.q || "").trim(),
        unitStoreId: Number(query.unitStoreId || 0),
        senderId: Number(query.senderId || 0),
        limit: Math.min(Number(query.limit) || 50, 100),
        offset: Number(query.offset) || 0,
        dateFrom: query.dateFrom ? new Date(String(query.dateFrom)) : undefined,
        dateTo: query.dateTo ? new Date(String(query.dateTo)) : undefined,
        hasImage: query.hasImage === "true",
        hasText: query.hasText === "true",
      });

      return ok(page);
    } catch (error) {
      return mapDomainError(error) ?? chatError(500, "Falha ao buscar mensagens");
    }
  }
}
