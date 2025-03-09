import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usescases/authentication/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/authentication/load-account-by-email-repository";
import { HashComparer } from "../../protocols/encrypter/hash-comparer";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer
  ) {}
  async auth(authentication: AuthenticationModel): Promise<string> {
    const accountBd = await this.loadAccountByEmailRepository.load(
      authentication.email
    );
    if (accountBd) {
      await this.hashCompare.compare(
        authentication.password,
        accountBd.password
      );
    }

    return null;
  }
}
