import { DbAddRegister } from "./db-add-register";
import { AddRegisterRepository } from "../../../protocols/db/register/add-register-repository";
import { LoadRegisterByNameRepository } from "../../../protocols/db/register/load-register-repository";
import {
  RegisterModel,
  AddRegisterModel,
} from "../add-register/db-add-register-protocols";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";

interface SutTypes {
  sut: DbAddRegister;
  registerRepositoryStub: AddRegisterRepository;
  registerByNameStub: LoadRegisterByNameRepository;
}

const makeRegister = (): RegisterModel => ({
  id: 1,
  client: {
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_phone",
  },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
    city: "any_city",
  },
});

const makeRegisterRepository = (): AddRegisterRepository => {
  class RegisterRepositoryStub implements AddRegisterRepository {
    async add(data: AddRegisterModel): Promise<RegisterModel> {
      return new Promise((resolve) => resolve(makeRegister()));
    }
  }
  return new RegisterRepositoryStub();
};

const makeRegisterByNameRepository = (): LoadRegisterByNameRepository => {
  class RegisterByNameRepositoryStub implements LoadRegisterByNameRepository {
    async findByName(name: string): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(null as any));
    }
  }
  return new RegisterByNameRepositoryStub();
};

const makeSut = (): SutTypes => {
  const registerRepositoryStub = makeRegisterRepository();
  const registerByNameStub = makeRegisterByNameRepository();
  const sut = new DbAddRegister(registerRepositoryStub);
  return {
    sut,
    registerRepositoryStub,
    registerByNameStub,
  };
};

const makeAddRegister = (): AddRegisterModel => ({
  client: { name: "any_name", lastName: "any_last_name", phone: "any_phone" },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
    city: "any_city",
  },
});

describe("DbAddRegister Usecase", () => {
  test("Should call AddRegisterRepository with correct values", async () => {
    const { sut, registerRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(registerRepositoryStub, "add");
    await sut.add(makeAddRegister());
    expect(addSpy).toHaveBeenCalledWith({
      client: {
        name: "any_name",
        lastName: "any_last_name",
        phone: "any_phone",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 123,
        reference: "any_reference",
        city: "any_city",
      },
    });
  });

  test("Should throw if AddRegisterRepository throws", async () => {
    const { sut, registerRepositoryStub } = makeSut();
    jest
      .spyOn(registerRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddRegister());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an Register on success", async () => {
    const { sut } = makeSut();

    const register = await sut.add(makeAddRegister());
    expect(register).toEqual(makeRegister());
  });
});
