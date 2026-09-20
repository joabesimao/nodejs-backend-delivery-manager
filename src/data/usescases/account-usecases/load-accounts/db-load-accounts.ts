import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import {
  LoadAccounts,
  LoadAccountsFilter,
} from "../../../../domain/usescases/account/load-accounts";
import { LoadAccountsRepository } from "../../../protocols/db/account/load-accounts-repository";

export class DbLoadAccounts implements LoadAccounts {
  constructor(
    private readonly loadAccountsRepository: LoadAccountsRepository,
  ) {}

  async load(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]> {
    return this.loadAccountsRepository.loadAll(filter);
  }
}
