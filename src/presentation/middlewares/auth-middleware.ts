import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { Middleware } from "../protocols/middleware";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByAccessToken: LoadAccountByToken) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.["x-access-token"];
    if (accessToken) {
      await this.loadAccountByAccessToken.load(accessToken);
    }
    return forbidden(new AccessDeniedError());
  }
}
