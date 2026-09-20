import { AccountRole } from "@prisma/client";
import { LoadAccounts } from "../../../../domain/usescases/account/load-accounts";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const VALID_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "entregador",
  "user",
];

export class LoadAccountsController implements Controller {
  constructor(private readonly loadAccounts: LoadAccounts) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { role, q } = httpRequest.query ?? {};
      const roleFilter =
        typeof role === "string" && VALID_ROLES.includes(role as AccountRole)
          ? (role as AccountRole)
          : undefined;
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
