import { AddOilChangeLog } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { InvalidKmError } from "../../../errors";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddOilChangeLogController implements Controller {
  constructor(
    private readonly addOilChangeLog: AddOilChangeLog,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { vehicleId, deliverymanId, km, changeDate } = httpRequest.body;
      const result = await this.addOilChangeLog.add({
        vehicleId: Number(vehicleId),
        deliverymanId: Number(deliverymanId),
        km: Number(km),
        changeDate: new Date(changeDate),
      });
      return ok(result);
    } catch (error) {
      if (error instanceof InvalidKmError) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}
