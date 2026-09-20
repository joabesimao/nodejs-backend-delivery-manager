import { EmailInUseError } from "../../../../presentation/errors";
import { LastAdminError } from "../../../../presentation/errors/last-admin-error";
import { SelfActionError } from "../../../../presentation/errors/self-action-error";
import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import {
  UpdateAccount,
  UpdateAccountModel,
} from "../../../../domain/usescases/account/update-account";
import { FindAccountByEmailRepository } from "../../../protocols/db/account/find-account-by-email-repository";
import { Hasher } from "../../../protocols/criptography/hasher";
import { CountActiveAdminsRepository } from "../../../protocols/db/account/count-active-admins-repository";
import { LoadAccountByIdRepository } from "../../../protocols/db/account/load-account-by-id-repository";
import { UpdateAccountRepository } from "../../../protocols/db/account/update-account-repository";

export class DbUpdateAccount implements UpdateAccount {
  constructor(
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly countActiveAdminsRepository: CountActiveAdminsRepository,
    private readonly updateAccountRepository: UpdateAccountRepository,
    private readonly hasher: Hasher,
  ) {}

  async update(
    id: number,
    data: UpdateAccountModel,
    requesterId: number,
  ): Promise<PublicAccountModel | null> {
    const target = await this.loadAccountByIdRepository.loadById(id);
    if (!target) {
      return null;
    }

    if (id === requesterId && data.active === false) {
      throw new SelfActionError();
    }

    const losingAdminPrivileges =
      target.role === "admin" &&
      ((data.role !== undefined && data.role !== "admin") ||
        data.active === false);

    if (losingAdminPrivileges) {
      const activeAdmins = await this.countActiveAdminsRepository.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw new LastAdminError();
      }
    }

    if (data.email && data.email !== target.email) {
      const existing = await this.findAccountByEmailRepository.loadAccountByEmail(
        data.email,
      );
      if (existing && existing.id !== id) {
        throw new EmailInUseError();
      }
    }

    const password = data.password
      ? await this.hasher.hash(data.password)
      : undefined;

    return this.updateAccountRepository.updateById(id, {
      ...data,
      password,
    });
  }
}
