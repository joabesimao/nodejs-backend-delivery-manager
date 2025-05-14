import { UpdateClient } from "../../../../domain/usescases/client/update-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateClientController implements Controller {
  constructor(private readonly updateClient: UpdateClient) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const updateClient = await this.updateClient.update(
        httpRequest.params.id,
        httpRequest.body
      );
      return ok(updateClient);
    } catch (error) {
      return serverError(error);
    }
  }
}
