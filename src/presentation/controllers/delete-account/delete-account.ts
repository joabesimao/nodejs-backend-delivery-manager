import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { DeleteAccount } from "../../../domain/usescases/delete-account/delete-account";

export class DeleteAccountController implements Controller {
  constructor(private readonly deleteAccount: DeleteAccount) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = await this.deleteAccount.deleteAccountById(
      httpRequest.params.id
    );
    return null;
  }
}
