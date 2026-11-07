import { AccountRole } from "./account-role";

export interface PublicAccountModel {
  id: number;
  name: string;
  email: string;
  role: AccountRole;
  active: boolean;
  unitStoreId: number | null;
}
