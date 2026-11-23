import { UpdateCity } from "../../../../domain/usecases/city/update-city";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateCityController implements Controller {
  constructor(private readonly updateCity: UpdateCity) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.updateCity.update(Number(id), httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
