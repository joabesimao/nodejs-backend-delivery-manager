import { DeleteAddress } from "../../../../domain/usescases/address/delete-address";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteAddressController implements Controller {
  constructor(private readonly deleteAddress: DeleteAddress) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const deleteAddress = await this.deleteAddress.delete(
        httpRequest.params.id
      );
      return ok(deleteAddress);
    } catch (error) {
      return serverError(error);
    }
  }
}
