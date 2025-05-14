import { Controller } from "../../../protocols/controller";
import { LoadClients } from "../../../../domain/usescases/client/load-client";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";

export class LoadClientController implements Controller {
  constructor(private readonly loadClient: LoadClients) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const clients = await this.loadClient.load();
      return clients.length ? ok(clients) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
