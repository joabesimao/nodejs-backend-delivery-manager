import { LoadDeliveryman } from "../../../../domain/usescases/deliveryman/load-deliveryman";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadDeliverymanController implements Controller {
  constructor(private readonly loadDeliveryman: LoadDeliveryman) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.loadDeliveryman.load();
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
