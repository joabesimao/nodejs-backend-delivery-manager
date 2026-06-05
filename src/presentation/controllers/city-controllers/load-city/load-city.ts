import { LoadCity } from "../../../../domain/usescases/city/load-city";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadCityController implements Controller {
  constructor(private readonly loadCity: LoadCity) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const cities = await this.loadCity.load();
      return ok(cities);
    } catch (error) {
      return serverError(error);
    }
  }
}
