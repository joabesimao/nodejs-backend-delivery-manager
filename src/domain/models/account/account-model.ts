export interface AccountModel {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: "principal" | "branch";
  unitStoreId?: number | null;
}
