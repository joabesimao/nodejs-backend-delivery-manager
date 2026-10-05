import { NOTIFICATION_TYPES, NotificationType } from "../../../../domain/models/notification/notification-model";
import { MarkAllNotificationsRead } from "../../../../domain/usescases/notification/mark-notification-read";
import { InvalidParamError } from "../../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class MarkAllNotificationsReadController implements Controller {
  constructor(private readonly markAllNotificationsRead: MarkAllNotificationsRead) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = Number(httpRequest.headers?.accountId);
      if (!recipientId) {
        return unauthorized();
      }
      const type = httpRequest.body?.type as NotificationType | undefined;
      if (type !== undefined && !NOTIFICATION_TYPES.includes(type)) {
        return badRequest(new InvalidParamError("type"));
      }
      const updated = await this.markAllNotificationsRead.markAllRead(recipientId, type);
      return ok({ updated });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
