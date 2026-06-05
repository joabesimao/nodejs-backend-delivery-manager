import { LoadNeighborhood } from "../../../../domain/usescases/neighborhood/load-neighborhood";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadNeighborhoodController implements Controller {
  constructor(private readonly loadNeighborhood: LoadNeighborhood) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const neighborhoods = await this.loadNeighborhood.load();
      return ok(neighborhoods);
    } catch (error) {
      return serverError(error);
    }
  }
}
