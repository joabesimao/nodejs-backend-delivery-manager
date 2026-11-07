import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";
import { DeleteAddress } from "../../../../domain/usescases/address/delete-address";
import { conflict, noExists, ok, serverError } from "../../../helpers/http/http-helper";
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
      if (error instanceof ResourceInUseError) {
        return conflict(error);
      }
      if (error instanceof NotFoundError) {
        return noExists();
      }
      return serverError(error);
    }
  }
}
