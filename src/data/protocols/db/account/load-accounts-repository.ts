import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { LoadAccountsFilter } from "../../../../domain/usescases/account/load-accounts";

export interface LoadAccountsRepository {
  loadAll(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]>;
}
