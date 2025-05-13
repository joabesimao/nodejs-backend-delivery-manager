import { DeleteClient } from "../../../../domain/usescases/client/delete-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteClientController implements Controller {
  constructor(private readonly deleteClient: DeleteClient) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const deletedClient = await this.deleteClient.delete(
        httpRequest.params.id
      );
      return ok(deletedClient);
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}
