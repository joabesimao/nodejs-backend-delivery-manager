import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMySqlRepository } from "../../../../infra/db/mysql/account-repository/account-repository";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class RefreshTokenController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly jwtAdapter: JwtAdapter,
    private readonly accountRepository: AccountMySqlRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { refreshToken } = httpRequest.body;
      const payload = await this.jwtAdapter.decode(refreshToken);

      if (!payload?.id || payload.type !== "refresh") {
        return unauthorized();
      }

      const account = await this.accountRepository.loadByToken(String(payload.id));
      if (!account) {
        return unauthorized();
      }

      const accessToken = await this.jwtAdapter.encrypt(String(account.id), {
        type: "access",
        expiresIn: "15m",
      });

      const newRefreshToken = await this.jwtAdapter.encrypt(String(account.id), {
        type: "refresh",
        expiresIn: "7d",
      });

      return ok({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}