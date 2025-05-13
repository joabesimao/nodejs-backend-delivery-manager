import { DbUpdateClient } from "./db-update-client";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { UpdateClientRepository } from "../../../protocols/db/client/update-client";
import {
  Client,
  ClientModel,
} from "../../../../domain/models/client/client-model";

const makeFakeClient = (): ClientModel => ({
  name: "any_name",
  lastName: "any_last_name",
  phone: "any_number",
});

interface SutTypes {
  sut: DbUpdateClient;
  updateClientRepositoryStub: UpdateClientRepository;
}

const makeUpdateClientRepository = (): UpdateClientRepository => {
  class UpdateClientRepositoryStub implements UpdateClientRepository {
    async update(id: number, infoToUpdate: Client): Promise<Client> {
      return new Promise((resolve) => resolve(makeFakeClient()));
    }
  }
  return new UpdateClientRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateClientRepositoryStub = makeUpdateClientRepository();
  const sut = new DbUpdateClient(updateClientRepositoryStub);
  return {
    sut,
    updateClientRepositoryStub,
  };
};

describe("DbLoadClients", () => {
  const id = 8;
  test("Should call UpdateClientRepository", async () => {
    const { sut, updateClientRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateClientRepositoryStub, "update");
    await sut.update(id, makeFakeClient());
    expect(updateSpy).toHaveBeenCalled();
  });

  test("Should call UpdateClientRepository with correct values", async () => {
    const { sut, updateClientRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateClientRepositoryStub, "update");
    await sut.update(id, makeFakeClient());
    expect(updateSpy).toHaveBeenCalledWith(8, makeFakeClient());
  });

  test("Should update one Client and return 200 on success", async () => {
    const { sut } = makeSut();
    const registers = await sut.update(id, makeFakeClient());
    expect(registers).toEqual(makeFakeClient());
  });

  test("Should throw if UpdateClientRepository throws", async () => {
    const { sut, updateClientRepositoryStub } = makeSut();
    jest
      .spyOn(updateClientRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, makeFakeClient());
    await expect(promise).rejects.toThrow();
  });
});
