import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { Authentication } from "../../../../domain/usescases/authentication/authentication";
import { Validation } from "../../../protocols/validation";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { env } from "../../../../../config/Env";

export class LoginController implements Controller {
  private readonly jwtAdapter: JwtAdapter;

  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
    jwtAdapter?: JwtAdapter
  ) {
    this.jwtAdapter = jwtAdapter ?? new JwtAdapter(env.JWT_SECRET);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }

      const payload = await this.jwtAdapter.decode(accessToken);
      const accountId = payload?.id;

      if (!accountId) {
        return ok({ accessToken });
      }

      const refreshToken = await this.jwtAdapter.encrypt(String(accountId), {
        type: "refresh",
        expiresIn: "7d",
      });

      return ok({ accessToken, refreshToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
