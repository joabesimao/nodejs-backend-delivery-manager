import { AccountRole } from "@prisma/client";

export interface AccountModel {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: AccountRole;
  unitStoreId?: number | null;
}
