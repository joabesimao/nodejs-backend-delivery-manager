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
import { Prisma } from "@prisma/client";
import { AccountInUseError } from "../../../errors/account-in-use-error";
import { LastAdminError } from "../../../errors/last-admin-error";
import { SelfActionError } from "../../../errors/self-action-error";

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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return conflict(new AccountInUseError());
        }
        return noExists();
      }
      return serverError(error);
    }
  }
}
