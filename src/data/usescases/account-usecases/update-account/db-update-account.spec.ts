import { DbUpdateAccount } from "./db-update-account";
import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { UpdateAccountModel } from "../../../../domain/usescases/account/update-account";
import { LoadAccountByIdRepository } from "../../../protocols/db/account/load-account-by-id-repository";
import { FindAccountByEmailRepository } from "../../../protocols/db/account/find-account-by-email-repository";
import { CountActiveAdminsRepository } from "../../../protocols/db/account/count-active-admins-repository";
import { UpdateAccountRepository } from "../../../protocols/db/account/update-account-repository";
import { UpdateRefreshTokenRepository } from "../../../protocols/db/access-token-repository/update-refresh-token-repository";
import { Hasher } from "../../../protocols/criptography/hasher";

interface SutTypes {
  sut: DbUpdateAccount;
  updateAccountRepositoryStub: UpdateAccountRepository;
  updateRefreshTokenRepositoryStub: UpdateRefreshTokenRepository;
}

const fakeAccount = (): PublicAccountModel => ({
  id: 2,
  name: "any_name",
  email: "any_email@email.com",
  role: "user",
  active: true,
  unitStoreId: null,
});

const makeSut = (): SutTypes => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(): Promise<PublicAccountModel | null> {
      return fakeAccount();
    }
  }
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async loadAccountByEmail(): Promise<AccountModel> {
      return null as unknown as AccountModel;
    }
  }
  class CountActiveAdminsRepositoryStub implements CountActiveAdminsRepository {
    async countActiveAdmins(): Promise<number> {
      return 2;
    }
  }
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateById(
      id: number,
      data: UpdateAccountModel,
    ): Promise<PublicAccountModel> {
      return { ...fakeAccount(), ...data };
    }
  }
  class UpdateRefreshTokenRepositoryStub implements UpdateRefreshTokenRepository {
    async updateRefreshToken(): Promise<void> {}
  }
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return "hashed_password";
    }
  }

  const updateAccountRepositoryStub = new UpdateAccountRepositoryStub();
  const updateRefreshTokenRepositoryStub = new UpdateRefreshTokenRepositoryStub();
  const sut = new DbUpdateAccount(
    new LoadAccountByIdRepositoryStub(),
    new FindAccountByEmailRepositoryStub(),
    new CountActiveAdminsRepositoryStub(),
    updateAccountRepositoryStub,
    new HasherStub(),
    updateRefreshTokenRepositoryStub,
  );
  return { sut, updateAccountRepositoryStub, updateRefreshTokenRepositoryStub };
};

describe("DbUpdateAccount Usecase", () => {
  test("Should persist the hashed password", async () => {
    const { sut, updateAccountRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, "updateById");
    await sut.update(2, { password: "new_password" }, 1);
    expect(updateSpy).toHaveBeenCalledWith(2, { password: "hashed_password" });
  });

  test("Should revoke the refresh token when the password changes", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    const revokeSpy = jest.spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken");
    await sut.update(2, { password: "new_password" }, 1);
    expect(revokeSpy).toHaveBeenCalledWith(2, null, null);
  });

  test("Should revoke the refresh token when the account is deactivated", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    const revokeSpy = jest.spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken");
    await sut.update(2, { active: false }, 1);
    expect(revokeSpy).toHaveBeenCalledWith(2, null, null);
  });

  test("Should not revoke the refresh token on other changes", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    const revokeSpy = jest.spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken");
    await sut.update(2, { name: "new_name", active: true }, 1);
    expect(revokeSpy).not.toHaveBeenCalled();
  });

  test("Should not revoke the refresh token if the update throws", async () => {
    const { sut, updateAccountRepositoryStub, updateRefreshTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccountRepositoryStub, "updateById")
      .mockRejectedValueOnce(new Error());
    const revokeSpy = jest.spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken");
    await expect(sut.update(2, { password: "new_password" }, 1)).rejects.toThrow();
    expect(revokeSpy).not.toHaveBeenCalled();
  });
});
