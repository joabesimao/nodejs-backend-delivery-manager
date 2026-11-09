import { LoadChatStatistics } from "../../../domain/usescases/chat/load-chat-statistics";
import { mapDomainError } from "../../helpers/http/map-domain-error";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { chatError, readOptionalAccountId } from "./chat-http";

export class GetChatStatisticsController implements Controller {
  constructor(private readonly loadChatStatistics: LoadChatStatistics) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const statistics = await this.loadChatStatistics.load(readOptionalAccountId(httpRequest));
      return ok({ statistics });
    } catch (error) {
      return mapDomainError(error) ?? chatError(500, "Falha ao carregar estatísticas");
    }
  }
}
