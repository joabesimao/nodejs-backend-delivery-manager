import { AccountModel } from "../../../domain/models/account/account-model";
import { LoadAccountByToken } from "../../../domain/usescases/auth-middleware/load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.decrypter.decrypt(accessToken);
    return new Promise((resolve) => resolve(null));
  }
}
