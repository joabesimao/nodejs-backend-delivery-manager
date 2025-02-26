import { DbAddRegister } from "./db-add-register";
import { AddRegisterRepository } from "../../protocols/db/register/add-register-repository";
import {
  RegisterModel,
  AddRegisterModel,
} from "../add-register/db-add-register-protocols";

interface SutTypes {
  sut: DbAddRegister;
  registerRepositoryStub: AddRegisterRepository;
}

const makeRegister = (): RegisterModel => ({
  id: 1,
  client: {
    id: 1,
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_phone",
  },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
  },
  quantity: "any_quantity",
  amount: 200,
});

const makeRegisterRepository = (): AddRegisterRepository => {
  class RegisterRepositoryStub implements AddRegisterRepository {
    async add(data: AddRegisterModel): Promise<RegisterModel> {
      return new Promise((resolve) => resolve(makeRegister()));
    }
  }
  return new RegisterRepositoryStub();
};

const makeSut = (): SutTypes => {
  const registerRepositoryStub = makeRegisterRepository();
  const sut = new DbAddRegister(registerRepositoryStub);
  return {
    sut,
    registerRepositoryStub,
  };
};

const makeAddRegister = (): AddRegisterModel => ({
  client: { name: "any_name", lastName: "any_last_name", phone: "any_phone" },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
  },
  quantity: "any_quantity",
  amount: 1,
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
      },
      quantity: "any_quantity",
      amount: 1,
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
