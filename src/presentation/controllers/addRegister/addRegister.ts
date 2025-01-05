import { AddRegister } from "../../../domain/usescases/addRegister/add-register";
import { serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class AddRegisterController implements Controller {
  constructor(private readonly addRegister: AddRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.addRegister.add(httpRequest.body);
      return null;
    } catch (error) {
      return serverError(error);
    }
  }
}
