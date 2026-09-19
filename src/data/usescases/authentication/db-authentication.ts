import {
  Authentication,
  AuthenticationModel,
  AuthenticationResult,
} from "../../../domain/usescases/authentication/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/authentication/load-account-by-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { UpdateAccessTokenRepository } from "../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { UpdateRefreshTokenRepository } from "../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import { hashToken } from "../../../utils/hash-token";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly updateRefreshTokenRepository: UpdateRefreshTokenRepository,
    private readonly accessTokenExpiresIn: string,
    private readonly refreshTokenExpiresIn: string
  ) {}

  async auth(
    authentication: AuthenticationModel
  ): Promise<AuthenticationResult | null> {
    const accountBd = await this.loadAccountByEmailRepository.loadAccountByEmail(
      authentication.email
    );
    if (!accountBd) {
      return null;
    }

    const isValid = await this.hashCompare.compare(
      authentication.password,
      accountBd.password
    );
    if (!isValid) {
      return null;
    }

    const accessToken = await this.encrypter.encrypt(String(accountBd.id), {
      type: "access",
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = await this.encrypter.encrypt(String(accountBd.id), {
      type: "refresh",
      expiresIn: this.refreshTokenExpiresIn,
    });

    await this.updateAccessTokenRepository.updateAccessToken(
      accountBd.id,
      accessToken
    );

    const decoded = await this.encrypter.decode(refreshToken);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null;
    await this.updateRefreshTokenRepository.updateRefreshToken(
      accountBd.id,
      hashToken(refreshToken),
      expiresAt
    );

    return { accessToken, refreshToken };
  }
}
