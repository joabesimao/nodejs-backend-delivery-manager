import { LoadRegistersController } from "./load-register";
import { LoadRegisters } from "../../../domain/usescases/loadRegister/load-register";
import { LoadRegisterModel } from "../../../domain/models/register/register-load-model";
import { ok, serverError } from "../../helpers/http/http-helper";

const makeFakeRegisters = (): LoadRegisterModel[] => {
  return [
    {
      id: 1,
      client: {
        id: 2,
        name: "any_name",
        lastName: "any_last_name",
        phone: "any_number",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 1,
        reference: "any_reference",
      },
      amount: 2,
      quantity: "any_quantity",
    },
    {
      id: 2,
      client: {
        id: 3,
        name: "other_name",
        lastName: "other_last_name",
        phone: "other_number",
      },
      address: {
        street: "other_street",
        neighborhood: "other_neighborhood",
        numberHouse: 1,
        reference: "other_reference",
      },
      amount: 2,
      quantity: "other_quantity",
    },
  ];
};

interface SutTypes {
  sut: LoadRegistersController;
  loadRegisterStub: LoadRegisters;
}

const makeLoadRegisters = (): LoadRegisters => {
  class LoadRegisterStub implements LoadRegisters {
    async load(): Promise<LoadRegisterModel[]> {
      return new Promise((resolve) => resolve(makeFakeRegisters()));
    }
  }
  return new LoadRegisterStub();
};

const makeSut = (): SutTypes => {
  const loadRegisterStub = makeLoadRegisters();
  const sut = new LoadRegistersController(loadRegisterStub);
  return {
    sut,
    loadRegisterStub,
  };
};

describe("Load Register Controller", () => {
  test("Should call LoadRegister", async () => {
    const { sut, loadRegisterStub } = makeSut();
    const loadSpy = jest.spyOn(loadRegisterStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeRegisters()));
  });

  test("Should return 500 if LoadRegister throws", async () => {
    const { sut, loadRegisterStub } = makeSut();
    jest
      .spyOn(loadRegisterStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
