import { DeleteNotification } from "../../../../domain/usescases/notification/delete-notification";
import { InvalidParamError } from "../../../errors";
import { badRequest, noContent, noExists, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteNotificationController implements Controller {
  constructor(private readonly deleteNotification: DeleteNotification) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = Number(httpRequest.headers?.accountId);
      if (!recipientId) {
        return unauthorized();
      }
      const id = Number(httpRequest.params?.id);
      if (!Number.isInteger(id) || id <= 0) {
        return badRequest(new InvalidParamError("id"));
      }
      const deleted = await this.deleteNotification.delete(recipientId, id);
      return deleted ? noContent() : noExists();
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
