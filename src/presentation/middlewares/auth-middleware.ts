import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden, ok, unauthorized } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Middleware } from "../protocols/middleware";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByAccessToken: LoadAccountByToken,
    private readonly roles?: string[],
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers?.["x-access-token"];

    if (!token) {
      console.warn("[auth] denied", { hasToken: false });
      return unauthorized();
    }

    try {
      const account = await this.loadAccountByAccessToken.load(token);
      if (!account) {
        console.warn("[auth] denied", { hasToken: true });
        return unauthorized();
      }

      if (this.roles?.length && !this.roles.includes(account.role)) {
        console.warn("[auth] forbidden", {
          accountId: account.id,
          role: account.role,
          allowedRoles: this.roles,
        });
        return forbidden(new AccessDeniedError());
      }

      console.info("[auth] authorized", {
        accountId: account.id,
        role: account.role,
      });

      return ok({
        accountId: account.id,
        accountRole: account.role,
        accountUnitStoreId: account.unitStoreId ?? null,
      });
    } catch {
      console.warn("[auth] token_error", { hasToken: true });
      return unauthorized();
    }
  }
}
