import { DbAddClient } from "./db-add-client";
import { AddClientRepository } from "../../../protocols/db/client/add-client";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/client/add-client";

interface SutTypes {
  sut: DbAddClient;
  clientRepositoryStub: AddClientRepository;
}

const makeClient = (): ClientModel => ({
  name: "any_name",
  lastName: "any_last_name",
  phone: "any_phone",
});

const makeClientRepository = (): AddClientRepository => {
  class ClientRepositoryStub implements AddClientRepository {
    async add(client: AddClientModel): Promise<ClientModel> {
      return new Promise((resolve) => resolve(makeClient()));
    }
  }
  return new ClientRepositoryStub();
};

const makeSut = (): SutTypes => {
  const clientRepositoryStub = makeClientRepository();

  const sut = new DbAddClient(clientRepositoryStub);
  return {
    sut,
    clientRepositoryStub,
  };
};

describe("DbAddClient Usecase", () => {
  test("Should call AddClientRepository with correct values", async () => {
    const { sut, clientRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(clientRepositoryStub, "add");
    await sut.add(makeClient());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      lastName: "any_last_name",
      phone: "any_phone",
    });
  });

  test("Should throw if AddClientRepository throws", async () => {
    const { sut, clientRepositoryStub } = makeSut();
    jest
      .spyOn(clientRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeClient());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an Client on success", async () => {
    const { sut } = makeSut();
    const register = await sut.add(makeClient());
    expect(register).toEqual(makeClient());
  });
});
