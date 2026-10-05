import { MarkNotificationRead } from "../../../../domain/usescases/notification/mark-notification-read";
import { InvalidParamError } from "../../../errors";
import { badRequest, noExists, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class MarkNotificationReadController implements Controller {
  constructor(private readonly markNotificationRead: MarkNotificationRead) {}

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
      const notification = await this.markNotificationRead.markRead(recipientId, id);
      if (!notification) {
        return noExists();
      }
      return ok(notification);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
