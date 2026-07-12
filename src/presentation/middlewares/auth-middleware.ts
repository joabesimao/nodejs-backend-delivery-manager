import { ok, serverError, unauthorized } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Middleware } from "../protocols/middleware";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByAccessToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"];
      if (!accessToken) {
        return unauthorized();
      }

      const account = await this.loadAccountByAccessToken.load(
        accessToken,
        this.role,
      );

      if (account) {
        return ok({
          accountId: account.id,
          accountRole: account.role,
          accountUnitStoreId: account.unitStoreId ?? null,
        }) as unknown as any;
      }

      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}
