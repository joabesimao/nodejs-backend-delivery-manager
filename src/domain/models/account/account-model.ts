import { AccountRole } from "@prisma/client";

export interface AccountModel {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: AccountRole;
  active?: boolean;
  unitStoreId?: number | null;
  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;
}
