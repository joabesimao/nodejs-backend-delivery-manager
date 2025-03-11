import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usescases/authentication/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/authentication/load-account-by-email-repository";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { UpdateAccessTokenRepository } from "../../../data/protocols/db/access-token-repository/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}
  async auth(authentication: AuthenticationModel): Promise<string> {
    const accountBd =
      await this.loadAccountByEmailRepository.loadAccountByEmail(
        authentication.email
      );
    if (accountBd) {
      const isValid = await this.hashCompare.compare(
        authentication.password,
        accountBd.password
      );
      if (isValid) {
        const token = await this.encrypter.encrypt(String(accountBd.id));
        await this.updateAccessTokenRepository.updateAccessToken(
          accountBd.id,
          token
        );
        return token;
      }
    }

    return null;
  }
}
