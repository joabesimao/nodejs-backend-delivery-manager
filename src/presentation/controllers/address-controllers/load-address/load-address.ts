import { LoadAddress } from "../../../../domain/usescases/address/load-address";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadAddressController implements Controller {
  constructor(private readonly loadAddress: LoadAddress) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const addressList = await this.loadAddress.load();
      return addressList.length ? ok(addressList) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
