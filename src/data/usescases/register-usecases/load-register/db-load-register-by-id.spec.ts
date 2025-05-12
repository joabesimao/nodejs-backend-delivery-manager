import { DbLoadRegistersById } from "./db-load-register-by-id";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadRegisterByIdRepository } from "../../../../data/protocols/db/register/load-register-repository";

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
  sut: DbLoadRegistersById;
  loadRegisterByIdRepositoryStub: LoadRegisterByIdRepository;
}

const makeLoadRegisterByIdRepository = (): LoadRegisterByIdRepository => {
  class LoadRegisterByIdRepositoryStub implements LoadRegisterByIdRepository {
    async loadById(id: number): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegister()));
    }
  }
  return new LoadRegisterByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadRegisterByIdRepositoryStub = makeLoadRegisterByIdRepository();
  const sut = new DbLoadRegistersById(loadRegisterByIdRepositoryStub);
  return {
    sut,
    loadRegisterByIdRepositoryStub,
  };
};

describe("DbLoadRegistersById", () => {
  const id = 7;

  test("Should call LoadRegisterByIdRepository with correct values", async () => {
    const { sut, loadRegisterByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadRegisterByIdRepositoryStub, "loadById");
    await sut.loadById(id);
    expect(loadByIdSpy).toHaveBeenCalledWith(7);
  });

  test("Should return one Register on success", async () => {
    const { sut } = makeSut();
    const register = await sut.loadById(id);
    expect(register).toEqual(makeFakeRegister());
  });

  test("Should throw if LoadRegisterByIdRepository throws", async () => {
    const { sut, loadRegisterByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadRegisterByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadById(id);
    await expect(promise).rejects.toThrow();
  });
});
