import { DeleteAccountController } from "./delete-account";
import { DeleteAccount } from "../../../domain/usescases/delete-account/delete-account";
import { HttpRequest } from "../../protocols/http";

const makeDeleteAccountStub = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async deleteAccountById(id: Number): Promise<string> {
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
      lastName: "ultimo_nome",
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
});

describe("DeleteAccount Controller", () => {
  test("Should call DeleteAccount with correct values", async () => {
    const { sut, deleteAccountStub } = makeSut();
    const deleteAccountSpy = jest.spyOn(deleteAccountStub, "deleteAccountById");
    await sut.handle(fakehttpRequest());
    expect(deleteAccountSpy).toHaveBeenCalledWith(1);
  });
});
