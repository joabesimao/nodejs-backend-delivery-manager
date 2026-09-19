import { UpdateRefreshTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import {
  noContent,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LogoutController implements Controller {
  constructor(
    private readonly updateRefreshTokenRepository: UpdateRefreshTokenRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId = httpRequest.headers?.accountId;
      if (!accountId) {
        return unauthorized();
      }

      await this.updateRefreshTokenRepository.updateRefreshToken(
        Number(accountId),
        null,
        null,
      );

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
