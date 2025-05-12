import { DbLoadRegistersByName } from "./db-load-register-by-name";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadRegisterByNameRepository } from "../../../protocols/db/register/load-register-repository";

const makeFakeRegister = (): LoadRegisterModel => ({
  id: 1,
  client: {
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_number",
  },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 1,
    reference: "any_reference",
    city: "any_city",
  },
});

interface SutTypes {
  sut: DbLoadRegistersByName;
  loadRegisterByNameRepositoryStub: LoadRegisterByNameRepository;
}

const makeLoadRegisterByNameRepository = (): LoadRegisterByNameRepository => {
  class LoadRegisterByNameRepositoryStub
    implements LoadRegisterByNameRepository
  {
    async findByName(name: string): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegister()));
    }
  }
  return new LoadRegisterByNameRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadRegisterByNameRepositoryStub = makeLoadRegisterByNameRepository();
  const sut = new DbLoadRegistersByName(loadRegisterByNameRepositoryStub);
  return {
    sut,
    loadRegisterByNameRepositoryStub,
  };
};

describe("DbLoadRegistersByName", () => {
  const name = "Joabe";

  test("Should call LoadRegisterByNameRepository with correct values", async () => {
    const { sut, loadRegisterByNameRepositoryStub } = makeSut();
    const loadByNameSpy = jest.spyOn(
      loadRegisterByNameRepositoryStub,
      "findByName"
    );
    await sut.loadByName(name);
    expect(loadByNameSpy).toHaveBeenCalledWith("Joabe");
  });

  test("Should return one Register on success", async () => {
    const { sut } = makeSut();
    const register = await sut.loadByName(name);
    expect(register).toEqual(makeFakeRegister());
  });

  test("Should throw if LoadRegisterByIdRepository throws", async () => {
    const { sut, loadRegisterByNameRepositoryStub } = makeSut();
    jest
      .spyOn(loadRegisterByNameRepositoryStub, "findByName")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadByName(name);
    await expect(promise).rejects.toThrow();
  });
});
