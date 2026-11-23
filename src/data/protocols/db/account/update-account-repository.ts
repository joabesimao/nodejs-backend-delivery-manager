import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { UpdateAccountModel } from "../../../../domain/usecases/account/update-account";

export interface UpdateAccountRepository {
  updateById(
    id: number,
    data: UpdateAccountModel,
  ): Promise<PublicAccountModel>;
}
