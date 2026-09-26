import { AddClientController } from "./add-client";
import { HttpRequest } from "../../../protocols/http";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { CpfInUseError } from "../../../errors";
import {
  Client,
  ClientModel,
} from "../../../../domain/models/client/client-model";
import {
  AddClient,
  AddClientModel,
} from "../../../../domain/usescases/client/add-client";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    cpf: "any_cpf",
    phone: "any_phone",
  },
});

const makeFakeClientModel = (): ClientModel => ({
  name: "any_name",
  cpf: "any_cpf",
  phone: "any_phone",
});

interface SutTypes {
  sut: AddClientController;
  addClientStub: AddClient;
}
const makeAddClientStub = (): AddClient => {
  class AddClientStub implements AddClient {
    async add(client: AddClientModel): Promise<Client> {
      return await new Promise((resolve) => resolve(makeFakeClientModel()));
    }
  }
  return new AddClientStub();
};

const makeSut = (): SutTypes => {
  const addClientStub = makeAddClientStub();
  const sut = new AddClientController(addClientStub);
  return {
    sut,
    addClientStub,
  };
};

describe("addClient Controller", () => {
  test("Should call addClient with correct values", async () => {
    const { sut, addClientStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addClientStub, "add");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith({
      name: "any_name",
      cpf: "any_cpf",
      phone: "any_phone",
    });
  });

  test("Should return 500 if AddClient throws", async () => {
    const { sut, addClientStub } = makeSut();
    jest
      .spyOn(addClientStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()) as any)
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 409 if the cpf unique constraint fails", async () => {
    const { sut, addClientStub } = makeSut();
    jest
      .spyOn(addClientStub, "add")
      .mockRejectedValueOnce({ code: "P2002", meta: { target: ["cpf"] } });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(conflict(new CpfInUseError()));
  });

  test("Should return 200 on sucess", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeClientModel()));
  });
});
