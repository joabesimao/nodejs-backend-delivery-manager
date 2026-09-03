import { UpdateDeliveryman } from "../../../../domain/usescases/deliveryman/update-deliveryman";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateDeliverymanController implements Controller {
  constructor(
    private readonly updateDeliveryman: UpdateDeliveryman,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const result = await this.updateDeliveryman.update(Number(id), httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
