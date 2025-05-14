import { LoadRegisterByNameController } from "./load-register-by-name";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadOneRegistersByName } from "../../../../domain/usescases/register/load-one-register";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";

const makeFakeRegisters = (): LoadRegisterModel => ({
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
    name: "joabe",
  },
});

interface SutTypes {
  sut: LoadRegisterByNameController;
  loadRegisterByNameStub: LoadOneRegistersByName;
}

const makeLoadRegistersByName = (): LoadOneRegistersByName => {
  class LoadRegisterByNameStub implements LoadOneRegistersByName {
    async loadByName(name: string): Promise<LoadRegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegisters()));
    }
  }
  return new LoadRegisterByNameStub();
};

const makeSut = (): SutTypes => {
  const loadRegisterByNameStub = makeLoadRegistersByName();
  const sut = new LoadRegisterByNameController(loadRegisterByNameStub);
  return {
    sut,
    loadRegisterByNameStub,
  };
};

describe("Load Register by name Controller", () => {
  test("Should call LoadByName", async () => {
    const { sut, loadRegisterByNameStub } = makeSut();
    const loadSpy = jest.spyOn(loadRegisterByNameStub, "loadByName");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should call LoadByName with correct value", async () => {
    const { sut, loadRegisterByNameStub } = makeSut();
    const loadSpy = jest.spyOn(loadRegisterByNameStub, "loadByName");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalledWith("joabe");
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeRegisters()));
  });

  test("Should return 500 if LoadOneRegister throws", async () => {
    const { sut, loadRegisterByNameStub } = makeSut();
    jest
      .spyOn(loadRegisterByNameStub, "loadByName")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
