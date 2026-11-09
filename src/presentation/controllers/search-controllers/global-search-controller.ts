import { GlobalSearch } from "../../../domain/usescases/search/global-search";
import { ok, serverErrorMessage } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class GlobalSearchController implements Controller {
  constructor(private readonly globalSearch: GlobalSearch) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const query: unknown = httpRequest.query?.q;
      const term = typeof query === "string" ? query.trim() : "";
      return ok(await this.globalSearch.search(term));
    } catch (error) {
      console.error("[search] Erro ao buscar:", error);
      return serverErrorMessage("Falha ao realizar a busca");
    }
  }
}
