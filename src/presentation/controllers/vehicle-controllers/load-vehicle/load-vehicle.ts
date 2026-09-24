import { LoadVehicle } from "../../../../domain/usescases/vehicle/load-vehicle";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadVehicleController implements Controller {
  constructor(private readonly loadVehicle: LoadVehicle) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const vehicles = await this.loadVehicle.load();
      return ok(vehicles);
    } catch (error) {
      return serverError(error);
    }
  }
}
