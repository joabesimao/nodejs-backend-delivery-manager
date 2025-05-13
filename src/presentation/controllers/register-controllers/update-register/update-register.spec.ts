import { UpdateRegisterController } from "./update-register";
import { HttpRequest } from "../../../protocols/http";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { UpdateRegister } from "../../../../domain/usescases/register/update-register";
import { ok, serverError } from "../../../helpers/http/http-helper";

interface SutTypes {
  sut: UpdateRegisterController;
  updateRegisterStub: UpdateRegister;
}

const fakehttpRequest = (): HttpRequest => ({
  body: {
    id: 1,
    client: {
      lastName: "ultimo_nome",
      name: "any_name",
      phone: "123456747",
    },
    address: {
      street: "any_rua",
      neighborhood: "any_bairro",
      numberHouse: 1,
      reference: "any_referencia",
      city: "any_city",
    },
  },
  params: {
    id: 1,
  },
});

const makeFakeRegisters = (): RegisterModel => ({
  id: 1,
  client: {
    lastName: "ultimo_nome",
    name: "any_name",
    phone: "123456747",
  },
  address: {
    street: "any_rua",
    neighborhood: "any_bairro",
    numberHouse: 1,
    reference: "any_referencia",
    city: "any_city",
  },
});

const makeUpdateRegister = (): UpdateRegister => {
  class UpdateRegisterStub implements UpdateRegister {
    async update(
      id: number,
      info: Partial<RegisterModel>
    ): Promise<Promise<RegisterModel>> {
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
  test("Should call update", async () => {
    const { sut, updateRegisterStub } = makeSut();
    const updateSpy = jest.spyOn(updateRegisterStub, "update");
    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalled();
  });

  test("Should call update with correct values", async () => {
    const { sut, updateRegisterStub } = makeSut();
    const updateSpy = jest.spyOn(updateRegisterStub, "update");

    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, makeFakeRegisters());
  });

  test("Should call UpdateRegisterController on success", async () => {
    const { sut } = makeSut();

    const updateData = await sut.handle(fakehttpRequest());
    expect(updateData).toEqual(ok(makeFakeRegisters()));
  });

  test("Should return 500 if UpdateRegisterController throws", async () => {
    const { sut, updateRegisterStub } = makeSut();
    jest
      .spyOn(updateRegisterStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
