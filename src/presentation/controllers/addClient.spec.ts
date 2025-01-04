import {
  AddRegister,
  AddRegisterModel,
} from "../../domain/usescases/addRegister/add-register";
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    address: "any_address",
    phone: "any_phone",
    quantity: "any_quantity",
  },
});

const makeAddRegisterStub = (): AddRegister => {
  class AddRegisterStub implements AddRegister {
    async add(data: AddRegisterModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new AddRegisterStub();
};
describe("addRegister Controller", () => {
  test("Should call addRegister with correct values", async () => {
    const { sut, addRegisterStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addRegisterStub, "add");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith(fakeRequest.body);
  });
});
