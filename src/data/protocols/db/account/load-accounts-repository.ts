import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { LoadAccountsFilter } from "../../../../domain/usecases/account/load-accounts";

export interface LoadAccountsRepository {
  loadAll(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]>;
}
