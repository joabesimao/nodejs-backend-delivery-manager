import { AddDeliveryman } from "../../../../domain/usescases/deliveryman/add-deliveryman";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class AddDeliverymanController implements Controller {
  constructor(private readonly addDeliveryman: AddDeliveryman) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.addDeliveryman.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
