import { LoadOilChangeLog } from "../../../../domain/usescases/oil-change/load-oil-change-log";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOilChangeLogController implements Controller {
  constructor(private readonly loadOilChangeLog: LoadOilChangeLog) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { vehicleId, deliverymanId } = httpRequest.query || {};
      const logs = await this.loadOilChangeLog.load({
        ...(vehicleId && { vehicleId: Number(vehicleId) }),
        ...(deliverymanId && { deliverymanId: Number(deliverymanId) }),
      });
      return ok(logs);
    } catch (error) {
      return serverError(error);
    }
  }
}
