import {
  AddRegister,
  AddRegisterModel,
} from "../../../../domain/usescases/register/add-register";
import { AddAddressController } from "./add-address";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import {
  Client,
  ClientModel,
} from "../../../../domain/models/client/client-model";
import {
  AddClient,
  AddClientModel,
} from "../../../../domain/usescases/client/add-client";
import { Address } from "../../../../domain/models/register/address-model";
import {
  AddAddress,
  AddAddressModel,
} from "../../../../domain/usescases/address/add-address";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    street: "any_street",
    city: "any_city",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
  },
});

const makeFakeAddress = (): Address => ({
  street: "any_street",
  city: "any_city",
  neighborhood: "any_neighborhood",
  numberHouse: 123,
  reference: "any_reference",
});

interface SutTypes {
  sut: AddAddressController;
  addAddressStub: AddAddress;
}
const makeAddAddressStub = (): AddAddress => {
  class AddAddressStub implements AddAddress {
    async add(address: AddAddressModel): Promise<Address> {
      return new Promise((resolve) => resolve(makeFakeAddress()));
    }
  }
  return new AddAddressStub();
};

const makeSut = (): SutTypes => {
  const addAddressStub = makeAddAddressStub();
  const sut = new AddAddressController(addAddressStub);
  return {
    sut,
    addAddressStub,
  };
};

describe("addAddress Controller", () => {
  test("Should call addAddress with correct values", async () => {
    const { sut, addAddressStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addAddressStub, "add");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith(makeFakeAddress());
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(ok(makeFakeAddress()));
  });

  test("Should return 500 if AddClient throws", async () => {
    const { sut, addAddressStub } = makeSut();
    jest
      .spyOn(addAddressStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()) as any)
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
