import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import {
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";

export class DeleteAccountController implements Controller {
  constructor(private readonly deleteAccount: DeleteAccount) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params.id);
      const requesterId = Number(httpRequest.actor?.id);

      const account = await this.deleteAccount.deleteAccountById(
        id,
        requesterId,
      );
      return ok(account);
    } catch (error) {
      return mapDomainError(error) ?? serverError(error);
    }
  }
}
