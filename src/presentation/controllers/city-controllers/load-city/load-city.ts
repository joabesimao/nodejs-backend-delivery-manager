import { LoadCity } from "../../../../domain/usescases/city/load-city";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadCityController implements Controller {
  constructor(private readonly loadCity: LoadCity) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const cities = await this.loadCity.load();
      return cities.length ? ok(cities) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
