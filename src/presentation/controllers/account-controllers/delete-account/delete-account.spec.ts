import { DeleteAccountController } from "./delete-account";
import { DeleteAccount } from "../../../../domain/usescases/signup/delete-account";
import { HttpRequest } from "../../../protocols/http";
import {
  conflict,
  forbidden,
  noExists,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { AccountInUseError } from "../../../../domain/errors/account-in-use-error";
import { LastAdminError } from "../../../../domain/errors/last-admin-error";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { SelfActionError } from "../../../../domain/errors/self-action-error";

const makeDeleteAccountStub = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async deleteAccountById(id: number, requesterId: number): Promise<string> {
      return await new Promise((resolve) => resolve("conta apagada com sucesso"));
    }
  }
  return new DeleteAccountStub();
};

interface SutTypes {
  sut: DeleteAccountController;
  deleteAccountStub: DeleteAccount;
}

const makeSut = (): SutTypes => {
  const deleteAccountStub = makeDeleteAccountStub();
  const sut = new DeleteAccountController(deleteAccountStub);
  return {
    sut,
    deleteAccountStub,
  };
};

const fakehttpRequest = (): HttpRequest => ({
  body: {
    client: {
      id: 1,
      name: "any_name",
      phone: "123456747",
    },
    address: {
      street: "any_rua",
      neighborhood: "any_bairro",
      numberHouse: 1,
      reference: "any_referencia",
    },
  },
  params: {
    id: 1,
  },
  headers: {
    accountId: 999,
  },
});

describe("DeleteAccount Controller", () => {
  test("Should call DeleteAccount with correct values", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const deleteAccountSpy = jest.spyOn(deleteAccountStub, "deleteAccountById");
    await sut.handle(fakehttpRequest());
    expect(deleteAccountSpy).toHaveBeenCalledWith(1, 999);
  });

  test("Should return a message when DeleteAccount on success", async () => {
    const { sut } = makeSut();

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(ok("conta apagada com sucesso"));
  });

  test("Should return 500 if DeleteAccount throws", async () => {
    const { sut, deleteAccountStub } = makeSut();
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const deletedRegister = await sut.handle(fakehttpRequest());
    expect(deletedRegister).toEqual(serverError(new Error("")));
  });

  test("Should return noExists if DeleteAccount throws NotFoundError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const notFoundError = new NotFoundError();
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(notFoundError))
      );

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(noExists());
  });

  test("Should return conflict if DeleteAccount throws AccountInUseError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const accountInUseError = new AccountInUseError();
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(accountInUseError))
      );

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(conflict(new AccountInUseError()));
  });

  test("Should return forbidden if DeleteAccount throws SelfActionError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new SelfActionError()))
      );

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(forbidden(new SelfActionError()));
  });

  test("Should return forbidden if DeleteAccount throws LastAdminError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new LastAdminError()))
      );

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(forbidden(new LastAdminError()));
  });
});
