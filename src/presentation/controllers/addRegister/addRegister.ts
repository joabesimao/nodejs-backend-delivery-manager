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
    private readonly addRegister: AddRegister //  private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { client, address, quantity, amount } = httpRequest.body;
      const result = await this.addRegister.add({
        client: client,
        address: address,
        quantity: quantity,
        amount: amount,
      });

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
