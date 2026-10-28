import { UpdateFuelRefill, UpdateFuelRefillModel } from "../../../../domain/usescases/fuel-refill/update-fuel-refill";
import { InvalidKmError } from "../../../errors";
import { badRequest, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateFuelRefillController implements Controller {
  constructor(
    private readonly updateFuelRefill: UpdateFuelRefill,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { id } = httpRequest.params;
      const { vehicleId, deliverymanId, km, liters, pricePerLiter, totalValue, refillDate } = httpRequest.body;
      const data: UpdateFuelRefillModel = {
        ...(vehicleId !== undefined && { vehicleId: Number(vehicleId) }),
        ...(deliverymanId !== undefined && { deliverymanId: Number(deliverymanId) }),
        ...(km !== undefined && { km: Number(km) }),
        ...(liters !== undefined && { liters: Number(liters) }),
        ...(pricePerLiter !== undefined && { pricePerLiter: Number(pricePerLiter) }),
        ...(totalValue !== undefined && { totalValue: Number(totalValue) }),
        ...(refillDate !== undefined && { refillDate: new Date(refillDate) }),
      };
      const result = await this.updateFuelRefill.update(Number(id), data);
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
