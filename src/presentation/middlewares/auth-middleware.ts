import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden, ok } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Middleware } from "../protocols/middleware";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByAccessToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.headers?.["x-access-token"];

    try {
      const accessToken = token;
      if (accessToken) {
        const account = await this.loadAccountByAccessToken.load(
          accessToken,
          this.role,
        );
        if (account) {
          console.info("[auth] authorized", {
            accountId: account.id,
            role: account.role,
          });

          return ok({
            accountId: account.id,
            accountRole: account.role,
            accountUnitStoreId: account.unitStoreId ?? null,
          }) as unknown as any;
        }
      }

      console.warn("[auth] denied", {
        hasToken: Boolean(token),
      });

      return forbidden(new AccessDeniedError());
    } catch {
      console.warn("[auth] token_error", {
        hasToken: Boolean(token),
      });
      return forbidden(new AccessDeniedError());
    }
  }
}
