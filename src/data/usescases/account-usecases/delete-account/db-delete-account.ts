import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import { LastAdminError } from "../../../../presentation/errors/last-admin-error";
import { SelfActionError } from "../../../../presentation/errors/self-action-error";
import { CountActiveAdminsRepository } from "../../../protocols/db/account/count-active-admins-repository";
import { DeleteAccountRepository } from "../../../protocols/db/account/delete-account-repository";
import { LoadAccountByIdRepository } from "../../../protocols/db/account/load-account-by-id-repository";

export class DbDeleteAccountById implements DeleteAccount {
  constructor(
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly countActiveAdminsRepository: CountActiveAdminsRepository,
    private readonly deleteAccountByIdRepository: DeleteAccountRepository,
  ) {}

  async deleteAccountById(id: number, requesterId: number): Promise<string> {
    const target = await this.loadAccountByIdRepository.loadById(id);
    if (!target) {
      return await this.deleteAccountByIdRepository.deleteById(id);
    }

    if (id === requesterId) {
      throw new SelfActionError();
    }

    if (target.role === "admin") {
      const activeAdmins = await this.countActiveAdminsRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new LastAdminError();
      }
    }

    return await this.deleteAccountByIdRepository.deleteById(id);
  }
}
