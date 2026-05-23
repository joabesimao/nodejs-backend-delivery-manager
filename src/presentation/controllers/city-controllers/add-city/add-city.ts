import { AddCity } from "../../../../domain/usescases/city/add-city";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class AddCityController implements Controller {
  constructor(private readonly addCity: AddCity) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.addCity.add(httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
