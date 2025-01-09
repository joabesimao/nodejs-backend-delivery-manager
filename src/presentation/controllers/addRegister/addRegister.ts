import { AddRegister } from "../../../domain/usescases/addRegister/add-register";
import {
  badRequest,
  noContent,
  ok,
  serverError,
} from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { Validation } from "../../protocols/validation";

export class AddRegisterController implements Controller {
  constructor(
    private readonly addRegister: AddRegister,
    private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, address, phone, quantity } = httpRequest.body;
      await this.addRegister.add({ name, address, phone, quantity });
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
