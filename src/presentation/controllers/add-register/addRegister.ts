import { AddRegister } from "../../../domain/usescases/addRegister/add-register";
import { MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class AddRegisterController implements Controller {
  constructor(private readonly addRegister: AddRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { client, address, quantity, amount } = httpRequest.body;
      const requireFields = ["client", "address", "quantity", "amount"];
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
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
