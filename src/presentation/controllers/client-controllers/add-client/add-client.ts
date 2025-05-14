import { AddClient } from "../../../../domain/usescases/client/add-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class AddClientController implements Controller {
  constructor(private readonly addClient: AddClient) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.addClient.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
