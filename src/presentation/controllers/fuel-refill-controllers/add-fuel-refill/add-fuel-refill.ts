import { AddFuelRefill } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { InvalidKmError } from "../../../errors";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddFuelRefillController implements Controller {
  constructor(
    private readonly addFuelRefill: AddFuelRefill,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { vehicleId, deliverymanId, km, liters, pricePerLiter, totalValue, refillDate } = httpRequest.body;
      const result = await this.addFuelRefill.add({
        vehicleId: Number(vehicleId),
        deliverymanId: Number(deliverymanId),
        km: Number(km),
        liters: Number(liters),
        pricePerLiter: Number(pricePerLiter),
        totalValue: Number(totalValue),
        refillDate: new Date(refillDate),
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
