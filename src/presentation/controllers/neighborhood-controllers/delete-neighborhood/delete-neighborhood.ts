import { DeleteNeighborhood } from "../../../../domain/usecases/neighborhood/delete-neighborhood";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteNeighborhoodController implements Controller {
  constructor(private readonly deleteNeighborhood: DeleteNeighborhood) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteNeighborhood.delete(Number(id));
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
