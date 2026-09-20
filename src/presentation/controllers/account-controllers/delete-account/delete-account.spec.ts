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
import { Prisma } from "@prisma/client";
import { AccountInUseError } from "../../../errors/account-in-use-error";
import { LastAdminError } from "../../../errors/last-admin-error";
import { SelfActionError } from "../../../errors/self-action-error";

const makeDeleteAccountStub = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async deleteAccountById(id: number, requesterId: number): Promise<string> {
      return new Promise((resolve) => resolve("conta apagada com sucesso"));
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

  test("Should return noExists if DeleteAccount throws a PrismaClientKnownRequestError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Record not found",
      { code: "P2025", clientVersion: "6.7.0" }
    );
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(prismaError))
      );

    const deletedAccount = await sut.handle(fakehttpRequest());
    expect(deletedAccount).toEqual(noExists());
  });

  test("Should return conflict if DeleteAccount throws a foreign key PrismaClientKnownRequestError", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Foreign key constraint failed",
      { code: "P2003", clientVersion: "6.7.0" }
    );
    jest
      .spyOn(deleteAccountStub, "deleteAccountById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(prismaError))
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
