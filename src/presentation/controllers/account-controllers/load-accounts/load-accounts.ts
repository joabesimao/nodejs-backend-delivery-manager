import { isAccountRole } from "../../../../domain/models/account/account-role";
import { LoadAccounts } from "../../../../domain/usescases/account/load-accounts";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadAccountsController implements Controller {
  constructor(private readonly loadAccounts: LoadAccounts) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { role, q } = httpRequest.query ?? {};
      const roleFilter = isAccountRole(role) ? role : undefined;
      const qFilter = typeof q === "string" && q.trim() ? q.trim() : undefined;

      const accounts = await this.loadAccounts.load({
        role: roleFilter,
        q: qFilter,
      });

      return ok(accounts);
    } catch (error) {
      return serverError(error);
    }
  }
}
