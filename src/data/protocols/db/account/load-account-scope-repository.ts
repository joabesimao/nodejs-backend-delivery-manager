import { AccountRole } from "../../../../domain/models/account/account-role";
import { AccountScope } from "../../../../domain/models/store/account-scope";

export interface LoadAccountScopeRepository {
  loadScope(accountId: number): Promise<AccountScope | null>;
}

export interface LoadAccountRoleRepository {
  loadRole(accountId: number): Promise<AccountRole | null>;
}
