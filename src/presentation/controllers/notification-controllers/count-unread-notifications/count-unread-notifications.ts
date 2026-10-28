import { CountUnreadNotifications } from "../../../../domain/usescases/notification/count-unread-notifications";
import { ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class CountUnreadNotificationsController implements Controller {
  constructor(private readonly countUnreadNotifications: CountUnreadNotifications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = Number(httpRequest.headers?.accountId);
      if (!recipientId) {
        return unauthorized();
      }
      const unreadCount = await this.countUnreadNotifications.countUnread(recipientId);
      return ok({ unreadCount });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
