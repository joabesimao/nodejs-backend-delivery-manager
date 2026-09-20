import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";

export interface LoadAccountByIdRepository {
  loadById(id: number): Promise<PublicAccountModel | null>;
}
