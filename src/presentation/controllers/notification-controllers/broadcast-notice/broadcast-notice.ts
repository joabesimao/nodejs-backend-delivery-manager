import { AccountRole } from "@prisma/client";
import { BroadcastNotice } from "../../../../domain/usescases/notification/broadcast-notice";
import { InvalidParamError } from "../../../errors";
import { AccessDeniedError } from "../../../errors/access-denied-error";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

const ACCOUNT_ROLES: AccountRole[] = ["admin", "gerente_estoque", "entregador", "user"];
const TITLE_MAX_LENGTH = 191;
const BODY_MAX_LENGTH = 2000;

export class BroadcastNoticeController implements Controller {
  constructor(
    private readonly broadcastNotice: BroadcastNotice,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const senderId = Number(httpRequest.headers?.accountId);
      if (!senderId) {
        return unauthorized();
      }
      const body = httpRequest.body ?? {};
      const error = await this.validation.validate(body);
      if (error) {
        return badRequest(error);
      }
      const title = String(body.title).trim();
      const message = String(body.body).trim();
      if (title.length > TITLE_MAX_LENGTH) {
        return badRequest(new InvalidParamError("title"));
      }
      if (message.length > BODY_MAX_LENGTH) {
        return badRequest(new InvalidParamError("body"));
      }
      const roles = body.roles ?? [];
      if (!Array.isArray(roles) || roles.some((role: unknown) => !ACCOUNT_ROLES.includes(role as AccountRole))) {
        return badRequest(new InvalidParamError("roles"));
      }
      const unitStoreId = body.unitStoreId == null || body.unitStoreId === "" ? undefined : Number(body.unitStoreId);
      if (unitStoreId !== undefined && (!Number.isInteger(unitStoreId) || unitStoreId <= 0)) {
        return badRequest(new InvalidParamError("unitStoreId"));
      }

      const recipients = await this.broadcastNotice.broadcast({
        senderId,
        title,
        body: message,
        roles,
        unitStoreId,
      });
      return ok({ recipients });
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        return forbidden(error);
      }
      return serverError(error as Error);
    }
  }
}
