import { UpdateOilChangeLog, UpdateOilChangeLogModel } from "../../../../domain/usescases/oil-change/update-oil-change-log";
import { InvalidKmError } from "../../../errors";
import { badRequest, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateOilChangeLogController implements Controller {
  constructor(
    private readonly updateOilChangeLog: UpdateOilChangeLog,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { id } = httpRequest.params;
      const { vehicleId, deliverymanId, km, changeDate } = httpRequest.body;
      const data: UpdateOilChangeLogModel = {
        ...(vehicleId !== undefined && { vehicleId: Number(vehicleId) }),
        ...(deliverymanId !== undefined && { deliverymanId: Number(deliverymanId) }),
        ...(km !== undefined && { km: Number(km) }),
        ...(changeDate !== undefined && { changeDate: new Date(changeDate) }),
      };
      const result = await this.updateOilChangeLog.update(Number(id), data);
      if (!result) {
        return noExists();
      }
      return ok(result);
    } catch (error) {
      if (error instanceof InvalidKmError) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}
