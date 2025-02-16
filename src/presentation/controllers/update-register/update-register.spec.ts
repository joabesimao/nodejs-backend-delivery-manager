import { UpdateRegisterController } from "./update-register";
import { HttpRequest } from "../../protocols/http";
import { RegisterModel } from "../../../domain/models/register/register-model";
import { UpdateRegister } from "../../../domain/usescases/updateRegister/update-register";

interface SutTypes {
  sut: UpdateRegisterController;
  updateRegisterStub: UpdateRegister;
}

const fakehttpRequest = (): HttpRequest => ({
  body: {
    id: 1,
    client: {
      id: 1,
      lastName: "ultimo_nome",
      name: "any_name",
      phone: "123456747",
    },
    address: {
      street: "any_rua",
      neighborhood: "any_bairro",
      numberHouse: 1,
      reference: "any_referencia",
    },
    amount: 10,
    quantity: "1",
  },
  params: {
    id: 1,
  },
});

const makeFakeRegisters = (): RegisterModel => ({
  id: 1,
  client: {
    id: 1,
    lastName: "ultimo_nome",
    name: "any_name",
    phone: "123456747",
  },
  address: {
    street: "any_rua",
    neighborhood: "any_bairro",
    numberHouse: 1,
    reference: "any_referencia",
  },
  amount: 10,
  quantity: "1",
});

const makeUpdateRegister = (): UpdateRegister => {
  class UpdateRegisterStub implements UpdateRegister {
    async update(
      id: number,
      info: Partial<RegisterModel>
    ): Promise<RegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegisters()));
    }
  }
  return new UpdateRegisterStub();
};

const makeSut = (): SutTypes => {
  const updateRegisterStub = makeUpdateRegister();
  const sut = new UpdateRegisterController(updateRegisterStub);
  return {
    sut,
    updateRegisterStub,
  };
};

describe("Update one Register Controller", () => {
  test("Should call UpdateOneRegister", async () => {
    const { sut, updateRegisterStub } = makeSut();
    const loadSpy = jest.spyOn(updateRegisterStub, "update");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });
});
