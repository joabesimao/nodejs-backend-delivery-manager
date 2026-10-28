import { AddClient } from "../../../../domain/usescases/client/add-client";
import { CpfInUseError } from "../../../errors";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class AddClientController implements Controller {
  constructor(private readonly addClient: AddClient) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.addClient.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("cpf")) {
        return conflict(new CpfInUseError());
      }
      return serverError(error);
    }
  }
}
