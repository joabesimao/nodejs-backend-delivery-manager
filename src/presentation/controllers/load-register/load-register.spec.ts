import { LoadRegistersController } from "./load-register";
import { LoadRegisters } from "../../../domain/usescases/loadRegister/load-register";
import { LoadRegisterModel } from "../../../domain/models/register/register-load-model";

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

describe("Load Register Controller", () => {
  test("Should call LoadRegister", async () => {
    class LoadRegisterStub implements LoadRegisters {
      async load(): Promise<LoadRegisterModel[]> {
        return new Promise((resolve) => resolve(makeFakeRegisters()));
      }
    }
    const loadRegisterStub = new LoadRegisterStub();
    const loadSpy = jest.spyOn(loadRegisterStub, "load");
    const sut = new LoadRegistersController(loadRegisterStub);
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
});
