import { LoadFuelRefill } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadFuelRefillController implements Controller {
  constructor(private readonly loadFuelRefill: LoadFuelRefill) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { vehicleId, deliverymanId } = httpRequest.query || {};
      const refills = await this.loadFuelRefill.load({
        ...(vehicleId && { vehicleId: Number(vehicleId) }),
        ...(deliverymanId && { deliverymanId: Number(deliverymanId) }),
      });
      return ok(refills);
    } catch (error) {
      return serverError(error);
    }
  }
}
