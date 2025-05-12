import { DbUpdateAddress } from "./db-update-address";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadAddressRepository } from "../../../protocols/db/address/load-address";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { Address } from "../../../../domain/models/register/address-model";
import { UpdateAddressRepository } from "../../../protocols/db/address/update-address";
import { UpdateAddressModel } from "../../../../domain/usescases/address/update-address";

const makeFakeAddress = (): Address => ({
  street: "any_street",
  city: "any_city",
  neighborhood: "any_neighborhood",
  numberHouse: 123,
  reference: "any_reference",
});

interface SutTypes {
  sut: DbUpdateAddress;
  updateAddressRepositoryStub: UpdateAddressRepository;
}

const makeUpdateAddressRepository = (): UpdateAddressRepository => {
  class UpdateAddressRepositoryStub implements UpdateAddressRepository {
    async update(
      id: number,
      infoToUpdate: UpdateAddressModel
    ): Promise<Address> {
      return new Promise((resolve) => resolve(makeFakeAddress()));
    }
  }
  return new UpdateAddressRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateAddressRepositoryStub = makeUpdateAddressRepository();
  const sut = new DbUpdateAddress(updateAddressRepositoryStub);
  return {
    sut,
    updateAddressRepositoryStub,
  };
};

describe("DbUpdateAddress", () => {
  const id = 7;
  test("Should call UpdateAddressRepository", async () => {
    const { sut, updateAddressRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(updateAddressRepositoryStub, "update");
    await sut.update(id, makeFakeAddress());
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return update address on success", async () => {
    const { sut } = makeSut();
    const address = await sut.update(id, makeFakeAddress());
    expect(address).toEqual(makeFakeAddress());
  });

  test("Should throw if UpdateAddressRepository throws", async () => {
    const { sut, updateAddressRepositoryStub } = makeSut();
    jest
      .spyOn(updateAddressRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, makeFakeAddress());
    await expect(promise).rejects.toThrow();
  });
});
