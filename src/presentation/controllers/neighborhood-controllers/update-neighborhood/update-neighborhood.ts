import { UpdateNeighborhood } from "../../../../domain/usecases/neighborhood/update-neighborhood";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateNeighborhoodController implements Controller {
  constructor(private readonly updateNeighborhood: UpdateNeighborhood) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.updateNeighborhood.update(Number(id), httpRequest.body);
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
