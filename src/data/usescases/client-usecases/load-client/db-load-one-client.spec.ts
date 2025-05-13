import { DbLoadOneClient } from "./db-load-one-client";
import { LoadOneClientRepository } from "../../../protocols/db/client/load-client";
import { ClientModel } from "../../../../domain/models/client/client-model";

const makeFakeClient = (): ClientModel => ({
  name: "any_name",
  lastName: "any_last_name",
  phone: "any_number",
});

interface SutTypes {
  sut: DbLoadOneClient;
  loadClientRepositoryStub: LoadOneClientRepository;
}

const makeLoadOneClientRepository = (): LoadOneClientRepository => {
  class LoadOneClientRepositoryStub implements LoadOneClientRepository {
    async loadOne(id: number): Promise<ClientModel> {
      return new Promise((resolve) => resolve(makeFakeClient()));
    }
  }
  return new LoadOneClientRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadClientRepositoryStub = makeLoadOneClientRepository();
  const sut = new DbLoadOneClient(loadClientRepositoryStub);
  return {
    sut,
    loadClientRepositoryStub,
  };
};

describe("DbLoadOneClients", () => {
  const id = 7;

  test("Should call LoadOneClientRepository", async () => {
    const { sut, loadClientRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadClientRepositoryStub, "loadOne");
    await sut.loadOne(id);
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return a list of client on success", async () => {
    const { sut } = makeSut();
    const registers = await sut.loadOne(id);
    expect(registers).toEqual(makeFakeClient());
  });

  test("Should throw if LoadClientRepository throws", async () => {
    const { sut, loadClientRepositoryStub } = makeSut();
    jest
      .spyOn(loadClientRepositoryStub, "loadOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadOne(id);
    await expect(promise).rejects.toThrow();
  });
});
