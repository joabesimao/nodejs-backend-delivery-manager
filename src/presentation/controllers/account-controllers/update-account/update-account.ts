import { UpdateAccount } from "../../../../domain/usescases/account/update-account";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";
import {
  badRequest,
  forbidden,
  noExists,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { LastAdminError } from "../../../errors/last-admin-error";
import { SelfActionError } from "../../../errors/self-action-error";
import { EmailInUseError } from "../../../errors";

export class UpdateAccountController implements Controller {
  constructor(
    private readonly updateAccount: UpdateAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const id = Number(httpRequest.params.id);
      const requesterId = Number(httpRequest.headers?.accountId);
      const { name, email, role, active, password } = httpRequest.body;

      const account = await this.updateAccount.update(
        id,
        { name, email, role, active, password },
        requesterId,
      );

      if (!account) {
        return noExists();
      }

      return ok(account);
    } catch (error) {
      if (error instanceof SelfActionError || error instanceof LastAdminError) {
        return forbidden(error);
      }
      if (error instanceof EmailInUseError) {
        return forbidden(error);
      }
      return serverError(error);
    }
  }
}
