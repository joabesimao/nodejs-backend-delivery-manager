import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import {
  conflict,
  forbidden,
  noExists,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { AccountInUseError } from "../../../../domain/errors/account-in-use-error";
import { LastAdminError } from "../../../../domain/errors/last-admin-error";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { SelfActionError } from "../../../../domain/errors/self-action-error";

export class DeleteAccountController implements Controller {
  constructor(private readonly deleteAccount: DeleteAccount) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params.id);
      const requesterId = Number(httpRequest.headers?.accountId);

      const account = await this.deleteAccount.deleteAccountById(
        id,
        requesterId,
      );
      return ok(account);
    } catch (error) {
      if (error instanceof SelfActionError || error instanceof LastAdminError) {
        return forbidden(error);
      }
      if (error instanceof AccountInUseError) {
        return conflict(error);
      }
      if (error instanceof NotFoundError) {
        return noExists();
      }
      return serverError(error);
    }
  }
}
