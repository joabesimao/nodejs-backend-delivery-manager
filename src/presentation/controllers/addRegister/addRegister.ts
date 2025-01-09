import { AddRegister } from "../../../domain/usescases/addRegister/add-register";
import { noContent, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class AddRegisterController implements Controller {
  constructor(private readonly addRegister: AddRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, address, phone, quantity } = httpRequest.body;
      await this.addRegister.add({ name, address, phone, quantity });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
