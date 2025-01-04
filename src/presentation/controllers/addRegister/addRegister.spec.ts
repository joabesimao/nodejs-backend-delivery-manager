import {
  AddRegister,
  AddRegisterModel,
} from "../../../domain/usescases/addRegister/add-register";
import { AddRegisterController } from "../../controllers/addRegister/addRegister";
import { HttpRequest } from "../../protocols/http";
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    address: "any_address",
    phone: "any_phone",
    quantity: "any_quantity",
  },
});

interface SutTypes {
  sut: AddRegisterController;
  addRegisterStub: AddRegister;
}
const makeAddRegisterStub = (): AddRegister => {
  class AddRegisterStub implements AddRegister {
    async add(data: AddRegisterModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRegisterStub();
};

const makeSut = (): SutTypes => {
  const addRegisterStub = makeAddRegisterStub();
  const sut = new AddRegisterController(addRegisterStub);
  return {
    sut,
    addRegisterStub,
  };
};
describe("addRegister Controller", () => {
  test("Should call addRegister with correct values", async () => {
    const { sut, addRegisterStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addRegisterStub, "add");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith({
      name: "any_name",
      address: "any_address",
      phone: "any_phone",
      quantity: "any_quantity",
    });
  });

  test("Should return 500 if AddRegister throws", async () => {
    const { sut, addRegisterStub } = makeSut();
    jest
      .spyOn(addRegisterStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
