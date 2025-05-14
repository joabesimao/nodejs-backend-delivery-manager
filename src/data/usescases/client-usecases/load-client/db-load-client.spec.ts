import { DbLoadClients } from "./db-load-client";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadClientRepository } from "../../../protocols/db/client/load-client";
import { ClientModel } from "../../../../domain/models/client/client-model";

const makeFakeClientList = (): ClientModel[] => {
  return [
    {
      name: "any_name",
      lastName: "any_last_name",
      phone: "any_number",
    },

    {
      name: "other_name",
      lastName: "other_last_name",
      phone: "other_number",
    },
  ];
};

interface SutTypes {
  sut: DbLoadClients;
  loadClientRepositoryStub: LoadClientRepository;
}

const makeLoadClientRepository = (): LoadClientRepository => {
  class LoadClientRepositoryStub implements LoadClientRepository {
    async loadAll(): Promise<ClientModel[]> {
      return new Promise((resolve) => resolve(makeFakeClientList()));
    }
  }
  return new LoadClientRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadClientRepositoryStub = makeLoadClientRepository();
  const sut = new DbLoadClients(loadClientRepositoryStub);
  return {
    sut,
    loadClientRepositoryStub,
  };
};

describe("DbLoadClients", () => {
  test("Should call LoadClientRepository", async () => {
    const { sut, loadClientRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadClientRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return a list of client on success", async () => {
    const { sut } = makeSut();
    const registers = await sut.load();
    expect(registers).toEqual(makeFakeClientList());
  });

  test("Should throw if LoadClientRepository throws", async () => {
    const { sut, loadClientRepositoryStub } = makeSut();
    jest
      .spyOn(loadClientRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
