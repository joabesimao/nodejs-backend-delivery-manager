import { UpdateVehicle } from "../../../../domain/usescases/vehicle/update-vehicle";
import { PlateInUseError } from "../../../errors";
import { badRequest, conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateVehicleController implements Controller {
  constructor(
    private readonly updateVehicle: UpdateVehicle,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        if (error instanceof PlateInUseError) {
          return conflict(error);
        }
        return badRequest(error);
      }
      const { id } = httpRequest.params;
      const result = await this.updateVehicle.update(Number(id), httpRequest.body);
      return ok(result);
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("plate")) {
        return conflict(new PlateInUseError());
      }
      return serverError(error);
    }
  }
}
