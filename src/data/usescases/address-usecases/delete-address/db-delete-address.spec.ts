import { DbDeleteAddress } from "./db-delete-address";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { DeleteAddressRepository } from "../../../protocols/db/address/delete-address";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { Address } from "../../../../domain/models/register/address-model";
import { UpdateAddressRepository } from "../../../protocols/db/address/update-address";
import { UpdateAddressModel } from "../../../../domain/usescases/address/update-address";

interface SutTypes {
  sut: DbDeleteAddress;
  deleteAddressRepositoryStub: DeleteAddressRepository;
}

const makeDeleteAddressRepository = (): DeleteAddressRepository => {
  class DeleteAddressRepositoryStub implements DeleteAddressRepository {
    async deleteOne(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Endereço apagado com Sucesso!"));
    }
  }
  return new DeleteAddressRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteAddressRepositoryStub = makeDeleteAddressRepository();
  const sut = new DbDeleteAddress(deleteAddressRepositoryStub);
  return {
    sut,
    deleteAddressRepositoryStub,
  };
};

describe("DbDeleteAddress", () => {
  const id = 7;

  test("Should call DeleteAddressRepository", async () => {
    const { sut, deleteAddressRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteAddressRepositoryStub, "deleteOne");
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalled();
  });

  test("Should call DeleteAddressRepository with correct values", async () => {
    const { sut, deleteAddressRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteAddressRepositoryStub, "deleteOne");
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalledWith(7);
  });

  test("Should return delete address on success", async () => {
    const { sut } = makeSut();
    const deletedAddress = await sut.delete(id);
    expect(deletedAddress).toEqual("Endereço apagado com Sucesso!");
  });

  test("Should throw if DeletedAddressRepository throws", async () => {
    const { sut, deleteAddressRepositoryStub } = makeSut();
    jest
      .spyOn(deleteAddressRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });
});
