import {
  Authentication,
  AuthenticationModel,
} from "../../../domain/usescases/authentication/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/authentication/load-account-by-email-repository";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}
  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  }
}
