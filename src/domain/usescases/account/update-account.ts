import { AccountRole } from "@prisma/client";
import { PublicAccountModel } from "../../models/account/public-account-model";

export interface UpdateAccountModel {
  name?: string;
  email?: string;
  role?: AccountRole;
  active?: boolean;
  password?: string;
}

export interface UpdateAccount {
  update(
    id: number,
    data: UpdateAccountModel,
    requesterId: number,
  ): Promise<PublicAccountModel | null>;
}
