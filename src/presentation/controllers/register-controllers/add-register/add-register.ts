import { AddRegister } from "../../../../domain/usescases/add-register/add-register";
import { MissingParamError } from "../../../errors";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddRegisterController implements Controller {
  constructor(
    private readonly addRegister: AddRegister //private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { client, address } = httpRequest.body;
      /* const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }  */

      const result = await this.addRegister.add({
        client: client,
        address: address,
      });

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
