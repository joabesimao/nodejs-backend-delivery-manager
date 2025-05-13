import { AddAddress } from "../../../../domain/usescases/address/add-address";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class AddAddressController implements Controller {
  constructor(private readonly addAddress: AddAddress) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.addAddress.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
