import { LoadNotifications } from "../../../../domain/usescases/notification/load-notifications";
import { ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const DEFAULT_PAGE_SIZE = 20;

export class LoadNotificationsController implements Controller {
  constructor(private readonly loadNotifications: LoadNotifications) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const recipientId = Number(httpRequest.headers?.accountId);
      if (!recipientId) {
        return unauthorized();
      }
      const { cursor, limit, unreadOnly } = httpRequest.query ?? {};
      const result = await this.loadNotifications.load({
        recipientId,
        cursor: Number(cursor) || undefined,
        limit: Number(limit) || DEFAULT_PAGE_SIZE,
        unreadOnly: unreadOnly === "true",
      });
      return ok(result);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
