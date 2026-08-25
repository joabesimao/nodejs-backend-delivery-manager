import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import { DeleteAccountRepository } from "../../../protocols/db/account/delete-account-repository";

export class DbDeleteAccountById implements DeleteAccount {
  constructor(
    private readonly deleteAccountByIdRepository: DeleteAccountRepository
  ) {}
  async deleteAccountById(id: number): Promise<string> {
    const deletedOnSuccess = await this.deleteAccountByIdRepository.deleteById(
      id
    );
    return deletedOnSuccess;
  }
}
