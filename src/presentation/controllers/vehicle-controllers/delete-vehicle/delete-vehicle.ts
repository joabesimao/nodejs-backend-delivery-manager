import { DeleteVehicle } from "../../../../domain/usescases/vehicle/delete-vehicle";
import { VehicleInUseError } from "../../../errors";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteVehicleController implements Controller {
  constructor(private readonly deleteVehicle: DeleteVehicle) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteVehicle.delete(Number(id));
      return ok(result);
    } catch (error) {
      if (error.code === "P2003") {
        return conflict(new VehicleInUseError());
      }
      return serverError(error);
    }
  }
}
