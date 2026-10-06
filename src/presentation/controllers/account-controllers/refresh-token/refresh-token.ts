import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMySqlRepository } from "../../../../infra/db/mysql/account-repository/account-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { hashToken } from "../../../../utils/hash-token";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export const REFRESH_TOKEN_GRACE_PERIOD_MS = 30 * 1000;

export class RefreshTokenController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly jwtAdapter: JwtAdapter,
    private readonly accountRepository: AccountMySqlRepository,
    private readonly accessTokenExpiresIn: string,
    private readonly refreshTokenExpiresIn: string,
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

      const account = await this.accountRepository.loadByToken(
        String(payload.id),
      );
      if (!account) {
        return unauthorized();
      }

      if (account.active === false) {
        await this.revoke(account.id);
        return unauthorized();
      }

      const incomingHash = hashToken(refreshToken);

      if (account.refreshTokenHash && account.refreshTokenHash === incomingHash) {
        const expired =
          !account.refreshTokenExpiresAt ||
          account.refreshTokenExpiresAt.getTime() < Date.now();
        if (expired) {
          await this.revoke(account.id);
          return unauthorized();
        }

        const accessToken = await this.issueAccessToken(account.id);
        const newRefreshToken = await this.jwtAdapter.encrypt(
          String(account.id),
          {
            type: "refresh",
            expiresIn: this.refreshTokenExpiresIn,
          },
        );
        const decoded = await this.jwtAdapter.decode(newRefreshToken);
        const newExpiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null;

        const rotated = await this.accountRepository.rotateRefreshToken(
          account.id,
          incomingHash,
          hashToken(newRefreshToken),
          newExpiresAt,
        );

        if (rotated) {
          return ok({ accessToken, refreshToken: newRefreshToken });
        }

        return ok({ accessToken });
      }

      if (this.isWithinGracePeriod(account, incomingHash)) {
        return ok({ accessToken: await this.issueAccessToken(account.id) });
      }

      await this.revoke(account.id);
      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }

  private isWithinGracePeriod(
    account: AccountModel,
    incomingHash: string,
  ): boolean {
    return (
      !!account.previousRefreshTokenHash &&
      account.previousRefreshTokenHash === incomingHash &&
      !!account.refreshTokenRotatedAt &&
      Date.now() - account.refreshTokenRotatedAt.getTime() <=
        REFRESH_TOKEN_GRACE_PERIOD_MS
    );
  }

  private async issueAccessToken(accountId: number): Promise<string> {
    return await this.jwtAdapter.encrypt(String(accountId), {
      type: "access",
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  private async revoke(accountId: number): Promise<void> {
    await this.accountRepository.updateRefreshToken(accountId, null, null);
  }
}
