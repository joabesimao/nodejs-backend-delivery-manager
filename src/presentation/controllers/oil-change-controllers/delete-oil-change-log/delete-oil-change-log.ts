import { DeleteOilChangeLog } from "../../../../domain/usescases/oil-change/delete-oil-change-log";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteOilChangeLogController implements Controller {
  constructor(private readonly deleteOilChangeLog: DeleteOilChangeLog) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const deleted = await this.deleteOilChangeLog.delete(Number(id));
      if (!deleted) {
        return noExists();
      }
      return ok("Deletado com sucesso!");
    } catch (error) {
      return serverError(error);
    }
  }
}
