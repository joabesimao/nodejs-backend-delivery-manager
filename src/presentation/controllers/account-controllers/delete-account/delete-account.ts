import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import { ok, serverError } from "../../../helpers/http/http-helper";

export class DeleteAccountController implements Controller {
  constructor(private readonly deleteAccount: DeleteAccount) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.deleteAccount.deleteAccountById(
        httpRequest.params.id
      );
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
