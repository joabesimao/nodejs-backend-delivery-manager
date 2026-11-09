import { AddDeliveryman } from "../../../../domain/usescases/deliveryman/add-deliveryman";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddDeliverymanController implements Controller {
  constructor(
    private readonly addDeliveryman: AddDeliveryman,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return mapDomainError(error) ?? badRequest(error);
      }
      const result = await this.addDeliveryman.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      return mapDomainError(error) ?? serverError(error);
    }
  }
}
