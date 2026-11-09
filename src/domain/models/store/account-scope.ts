export interface AccountScope {
  accountId: number;
  role: "principal" | "branch";
  unitStoreId: number | null;
  rootStoreId: number | null;
  visibleUnitIds: number[];
}
