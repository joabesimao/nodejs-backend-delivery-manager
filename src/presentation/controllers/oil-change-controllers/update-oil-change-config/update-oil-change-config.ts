import { UpdateOilChangeConfig } from "../../../../domain/usescases/oil-change/update-oil-change-config";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateOilChangeConfigController implements Controller {
  constructor(
    private readonly updateOilChangeConfig: UpdateOilChangeConfig,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const result = await this.updateOilChangeConfig.update({
        intervalKm: Number(httpRequest.body.intervalKm),
      });
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
