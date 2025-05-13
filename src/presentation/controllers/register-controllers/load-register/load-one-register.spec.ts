import { LoadOneRegistersController } from "./load-one-register";
import { LoadOneRegisters } from "../../../../domain/usescases/register/load-one-register";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols/http";

const makeFakeRegisters = (): LoadRegisterModel => ({
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

const fakehttpRequest = (): HttpRequest => ({
  body: {
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
  },
  params: {
    id: 1,
  },
});

interface SutTypes {
  sut: LoadOneRegistersController;
  loadOneRegisterStub: LoadOneRegisters;
}

const makeLoadRegisters = (): LoadOneRegisters => {
  class LoadRegisterStub implements LoadOneRegisters {
    async loadById(id: number): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegisters()));
    }
  }
  return new LoadRegisterStub();
};

const makeSut = (): SutTypes => {
  const loadOneRegisterStub = makeLoadRegisters();
  const sut = new LoadOneRegistersController(loadOneRegisterStub);
  return {
    sut,
    loadOneRegisterStub,
  };
};

describe("Load one Register Controller", () => {
  test("Should call LoadOneRegister", async () => {
    const { sut, loadOneRegisterStub } = makeSut();
    const loadSpy = jest.spyOn(loadOneRegisterStub, "loadById");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeRegisters()));
  });

  test("Should return 204 if LoadOneRegister returns empty", async () => {
    const { sut, loadOneRegisterStub } = makeSut();
    jest
      .spyOn(loadOneRegisterStub, "loadById")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 500 if LoadOneRegister throws", async () => {
    const { sut, loadOneRegisterStub } = makeSut();
    jest
      .spyOn(loadOneRegisterStub, "loadById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
