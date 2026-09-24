import { LoadOilChangeConfig } from "../../../../domain/usescases/oil-change/load-oil-change-config";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOilChangeConfigController implements Controller {
  constructor(private readonly loadOilChangeConfig: LoadOilChangeConfig) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const config = await this.loadOilChangeConfig.load();
      return ok(config);
    } catch (error) {
      return serverError(error);
    }
  }
}
