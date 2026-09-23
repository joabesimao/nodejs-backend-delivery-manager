import { UpdateClient } from "../../../../domain/usescases/client/update-client";
import { CpfInUseError } from "../../../errors";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
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
      if (error.code === "P2002" && error.meta?.target?.includes("cpf")) {
        return conflict(new CpfInUseError());
      }
      return serverError(error);
    }
  }
}
