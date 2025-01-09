import { DbAddRegister } from "./db-addRegister";
import { AddRegisterRepository } from "../../protocols/db/register/add-register-repository";
import { AddRegisterModel } from "../../../domain/usescases/addRegister/add-register";

interface SutTypes {
  sut: DbAddRegister;
  registerRepositoryStub: AddRegisterRepository;
}

const makeRegisterRepository = (): AddRegisterRepository => {
  class RegisterRepositoryStub implements AddRegisterRepository {
    async add(registerData: AddRegisterModel): Promise<void> {
      return new Promise((resolve) => resolve());
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

const makeRegister = (): AddRegisterModel => ({
  name: "any_name",
  address: "any_endereco",
  phone: "any_number",
  quantity: "any_quantity",
});

describe("DbAddRegister Usecase", () => {
  test("Should call AddRegisterRepository with correct values", async () => {
    const { sut, registerRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(registerRepositoryStub, "add");
    await sut.add(makeRegister());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
  address: "any_endereco",
  phone: "any_number",
  quantity: "any_quantity",
    });
  });
});
