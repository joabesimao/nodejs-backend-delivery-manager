import { DeleteCity } from "../../../../domain/usecases/city/delete-city";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteCityController implements Controller {
  constructor(private readonly deleteCity: DeleteCity) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteCity.delete(Number(id));
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
