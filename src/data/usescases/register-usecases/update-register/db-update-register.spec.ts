import { DbUpdateRegister } from "./db-update-register";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { UpdateRegisterRepository } from "../../../protocols/db/register/update-register-repository";

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
  sut: DbUpdateRegister;
  updateRegisterRepositoryStub: UpdateRegisterRepository;
}

const makeUpdateRepositoryStub = (): UpdateRegisterRepository => {
  class UpdateRegisterRepositoryStub implements UpdateRegisterRepository {
    async updateOneRegisterById(): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegister()));
    }
  }
  return new UpdateRegisterRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateRegisterRepositoryStub = makeUpdateRepositoryStub();
  const sut = new DbUpdateRegister(updateRegisterRepositoryStub);
  return {
    sut,
    updateRegisterRepositoryStub,
  };
};

describe("DbUpdateRegisters", () => {
  test("Should call UpdateRegisterRepository", async () => {
    const { sut, updateRegisterRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(
      updateRegisterRepositoryStub,
      "updateOneRegisterById"
    );
    await sut.update(1, {});
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return one register on success", async () => {
    const { sut } = makeSut();

    const registerUpdated = await sut.update(1, {});
    expect(registerUpdated).toEqual(makeFakeRegister());
  });

  test("Should throw if UpdateRegisterRepository throws", async () => {
    const { sut, updateRegisterRepositoryStub } = makeSut();
    jest
      .spyOn(updateRegisterRepositoryStub, "updateOneRegisterById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(2, {});
    await expect(promise).rejects.toThrow();
  });
});
