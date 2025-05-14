import { DbDeleteClient } from "./db-delete-client";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { DeleteClientRepository } from "../../../protocols/db/client/delete-client";
import { ClientModel } from "../../../../domain/models/client/client-model";

interface SutTypes {
  sut: DbDeleteClient;
  deleteClientRepositoryStub: DeleteClientRepository;
}

const makeDeleteClientRepository = (): DeleteClientRepository => {
  class DeleteClientRepositoryStub implements DeleteClientRepository {
    async deleteOne(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Cliente Deletado com Sucesso!"));
    }
  }
  return new DeleteClientRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteClientRepositoryStub = makeDeleteClientRepository();
  const sut = new DbDeleteClient(deleteClientRepositoryStub);
  return {
    sut,
    deleteClientRepositoryStub,
  };
};

describe("DbDeleteClients", () => {
  const id = 5;
  test("Should call DeleteClientRepository", async () => {
    const { sut, deleteClientRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(deleteClientRepositoryStub, "deleteOne");
    await sut.delete(id);
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should call DeleteClientRepository with correct values", async () => {
    const { sut, deleteClientRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(deleteClientRepositoryStub, "deleteOne");
    await sut.delete(id);
    expect(loadAllSpy).toHaveBeenCalledWith(5);
  });

  test("Should return deleteClient on success", async () => {
    const { sut } = makeSut();
    const registers = await sut.delete(id);
    expect(registers).toEqual("Cliente Deletado com Sucesso!");
  });

  test("Should throw if DeleteClientRepository throws", async () => {
    const { sut, deleteClientRepositoryStub } = makeSut();
    jest
      .spyOn(deleteClientRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });
});
