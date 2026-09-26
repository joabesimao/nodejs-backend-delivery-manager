import { DbDeleteAddress } from "./db-delete-address";
import { DeleteAddressRepository } from "../../../protocols/db/address/delete-address";

interface SutTypes {
  sut: DbDeleteAddress;
  deleteAddressRepositoryStub: DeleteAddressRepository;
}

const makeDeleteAddressRepository = (): DeleteAddressRepository => {
  class DeleteAddressRepositoryStub implements DeleteAddressRepository {
    async deleteOne(id: number): Promise<string> {
      return await new Promise((resolve) => resolve("Endereço apagado com Sucesso!"));
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
