import { LoadAddressController } from "./load-address";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { LoadAddress } from "../../../../domain/usescases/address/load-address";
import { Address } from "../../../../domain/models/register/address-model";

const makeFakeAddressList = (): Address[] => {
  return [
    {
      street: "any_street",
      city: "any_city",
      neighborhood: "any_neighborhood",
      numberHouse: 123,
      reference: "any_reference",
    },
    {
      street: "other_street",
      city: "other_any_city",
      neighborhood: "other_any_neighborhood",
      numberHouse: 123,
      reference: "other_reference",
    },
  ];
};

interface SutTypes {
  sut: LoadAddressController;
  loadAddressStub: LoadAddress;
}

const makeLoadAddress = (): LoadAddress => {
  class LoadAddressStub implements LoadAddress {
    async load(): Promise<Address[]> {
      return new Promise((resolve) => resolve(makeFakeAddressList()));
    }
  }
  return new LoadAddressStub();
};

const makeSut = (): SutTypes => {
  const loadAddressStub = makeLoadAddress();
  const sut = new LoadAddressController(loadAddressStub);
  return {
    sut,
    loadAddressStub,
  };
};

describe("Load Address Controller", () => {
  test("Should call LoadAllAddress", async () => {
    const { sut, loadAddressStub } = makeSut();
    const loadSpy = jest.spyOn(loadAddressStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return a list of client and return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeAddressList()));
  });

  test("Should return 204 if LoadAddress returns empty", async () => {
    const { sut, loadAddressStub } = makeSut();
    jest
      .spyOn(loadAddressStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 500 if LoadAddress throws", async () => {
    const { sut, loadAddressStub } = makeSut();
    jest
      .spyOn(loadAddressStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
