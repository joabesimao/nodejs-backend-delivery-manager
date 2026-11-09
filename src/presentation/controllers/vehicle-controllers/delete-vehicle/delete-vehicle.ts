import { DeleteVehicle } from "../../../../domain/usescases/vehicle/delete-vehicle";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";
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
      return mapDomainError(error) ?? serverError(error);
    }
  }
}
