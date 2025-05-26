import { Controller } from "../../../protocols/controller";
import { LoadOneClient } from "../../../../domain/usescases/client/load-client";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";

export class LoadOneClientController implements Controller {
  constructor(private readonly loadClient: LoadOneClient) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const oneClient = await this.loadClient.loadOne(httpRequest.params.id);
      return ok(oneClient);
    } catch (error) {
      return serverError(error);
    }
  }
}
