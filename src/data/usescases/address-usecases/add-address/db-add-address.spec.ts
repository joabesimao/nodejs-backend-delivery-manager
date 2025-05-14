import { DbAddAddress } from "./db-add-address";
import { AddClientRepository } from "../../../protocols/db/client/add-client";
import { AddAddressRepository } from "../../../protocols/db/address/add-address";

import { ClientModel } from "../../../../domain/models/client/client-model";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { AddClientModel } from "../../../../domain/usescases/client/add-client";
import { Address } from "../../../../domain/models/register/address-model";
import { AddAddressModel } from "../../../../domain/usescases/address/add-address";

interface SutTypes {
  sut: DbAddAddress;
  addressRepositoryStub: AddAddressRepository;
}

const makeAddress = (): Address => ({
  street: "any_street",
  city: "any_city",
  neighborhood: "any_neighborhood",
  numberHouse: 123,
  reference: "any_reference",
});

const makeAddressRepository = (): AddAddressRepository => {
  class AddressRepositoryStub implements AddAddressRepository {
    async add(address: AddAddressModel): Promise<Address> {
      return new Promise((resolve) => resolve(makeAddress()));
    }
  }
  return new AddressRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addressRepositoryStub = makeAddressRepository();

  const sut = new DbAddAddress(addressRepositoryStub);
  return {
    sut,
    addressRepositoryStub,
  };
};

describe("DbAddAddress Usecase", () => {
  test("Should call AddAddressRepository with correct values", async () => {
    const { sut, addressRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addressRepositoryStub, "add");
    await sut.add(makeAddress());
    expect(addSpy).toHaveBeenCalledWith({
      street: "any_street",
      city: "any_city",
      neighborhood: "any_neighborhood",
      numberHouse: 123,
      reference: "any_reference",
    });
  });

  test("Should throw if AddAddressRepository throws", async () => {
    const { sut, addressRepositoryStub } = makeSut();
    jest
      .spyOn(addressRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddress());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an Address on success", async () => {
    const { sut } = makeSut();
    const register = await sut.add(makeAddress());
    expect(register).toEqual({
      street: "any_street",
      city: "any_city",
      neighborhood: "any_neighborhood",
      numberHouse: 123,
      reference: "any_reference",
    });
  });
});
