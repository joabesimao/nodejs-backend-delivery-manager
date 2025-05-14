import { DbLoadAddress } from "./db-load-address";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadAddressRepository } from "../../../protocols/db/address/load-address";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { Address } from "../../../../domain/models/register/address-model";

const makeFakeAddressList = (): Address[] => {
  return [
    {
      street: "any_street",
      city: "any_city",
      neighborhood: "any_neighborhood",
      numberHouse: 123,
      reference: "any_reference",
    },
    {
      street: "other_street",
      city: "other_any_city",
      neighborhood: "other_any_neighborhood",
      numberHouse: 123,
      reference: "other_reference",
    },
  ];
};

interface SutTypes {
  sut: DbLoadAddress;
  loadAddressRepositoryStub: LoadAddressRepository;
}

const makeLoadAddressRepository = (): LoadAddressRepository => {
  class LoadAddressRepositoryStub implements LoadAddressRepository {
    async loadAll(): Promise<Address[]> {
      return new Promise((resolve) => resolve(makeFakeAddressList()));
    }
  }
  return new LoadAddressRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAddressRepositoryStub = makeLoadAddressRepository();
  const sut = new DbLoadAddress(loadAddressRepositoryStub);
  return {
    sut,
    loadAddressRepositoryStub,
  };
};

describe("DbLoadAddress", () => {
  test("Should call LoadAddressRepository", async () => {
    const { sut, loadAddressRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadAddressRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return a list of address on success", async () => {
    const { sut } = makeSut();
    const address = await sut.load();
    expect(address).toEqual(makeFakeAddressList());
  });

  test("Should throw if LoadAddressRepository throws", async () => {
    const { sut, loadAddressRepositoryStub } = makeSut();
    jest
      .spyOn(loadAddressRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
