import { DbLoadRegisters } from "./db-load-register";
import { LoadRegisterModel } from "../../../domain/models/register/register-load-model";
import { LoadRegisterRepository } from "../../protocols/db/register/load-register-repository";

const makeFakeRegisters = (): LoadRegisterModel[] => {
  return [
    {
      id: 1,
      client: {
        id: 2,
        name: "any_name",
        lastName: "any_last_name",
        phone: "any_number",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 1,
        reference: "any_reference",
      },
      amount: 2,
      quantity: "any_quantity",
    },
    {
      id: 2,
      client: {
        id: 3,
        name: "other_name",
        lastName: "other_last_name",
        phone: "other_number",
      },
      address: {
        street: "other_street",
        neighborhood: "other_neighborhood",
        numberHouse: 1,
        reference: "other_reference",
      },
      amount: 2,
      quantity: "other_quantity",
    },
  ];
};

interface SutTypes {
  sut: DbLoadRegisters;
  loadRegisterRepositoryStub: LoadRegisterRepository;
}

const makeLoadRegisterRepository = (): LoadRegisterRepository => {
  class LoadRegisterRepositoryStub implements LoadRegisterRepository {
    async loadAll(): Promise<LoadRegisterModel[]> {
      return new Promise((resolve) => resolve(makeFakeRegisters()));
    }
  }
  return new LoadRegisterRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadRegisterRepositoryStub = makeLoadRegisterRepository();
  const sut = new DbLoadRegisters(loadRegisterRepositoryStub);
  return {
    sut,
    loadRegisterRepositoryStub,
  };
};

describe("DbLoadRegisters", () => {
  test("Should call LoadRegisterRepository", async () => {
    const { sut, loadRegisterRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadRegisterRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return a list of Registers on success", async () => {
    const { sut } = makeSut();
    const registers = await sut.load();
    expect(registers).toEqual(makeFakeRegisters());
  });
});
