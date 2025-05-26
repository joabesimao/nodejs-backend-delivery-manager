import { UpdateAddressController } from "./update-address";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Address } from "../../../../domain/models/register/address-model";
import {
  UpdateAddress,
  UpdateAddressModel,
} from "../../../../domain/usescases/address/update-address";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const makeFakeAddress = (): Address => ({
  street: "any_street",
  city: "any_city",
  neighborhood: "any_neighborhood",
  numberHouse: 123,
  reference: "any_reference",
});

interface SutTypes {
  sut: UpdateAddressController;
  updateAddressStub: UpdateAddress;
}

const fakehttpRequest = (): HttpRequest => ({
  body: makeFakeAddress(),
  params: {
    id: 1,
  },
});

const makeUpdateAddress = (): UpdateAddress => {
  class UpdateAddressStub implements UpdateAddress {
    async update(
      id: number,
      infoToUpdate: UpdateAddressModel
    ): Promise<Address> {
      return new Promise((resolve) => resolve(makeFakeAddress()));
    }
  }
  return new UpdateAddressStub();
};

const makeSut = (): SutTypes => {
  const updateAddressStub = makeUpdateAddress();
  const sut = new UpdateAddressController(updateAddressStub);
  return {
    sut,
    updateAddressStub,
  };
};

describe("Update Address Controller", () => {
  test("Should call Updateddress", async () => {
    const { sut, updateAddressStub } = makeSut();
    const updateSpy = jest.spyOn(updateAddressStub, "update");
    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalled();
  });

  test("Should call Updateddress with correct infos", async () => {
    const { sut, updateAddressStub } = makeSut();
    const updateSpy = jest.spyOn(updateAddressStub, "update");
    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, makeFakeAddress());
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeAddress()));
  });

  test("Should return 500 if UpdateAddress throws", async () => {
    const { sut, updateAddressStub } = makeSut();
    jest
      .spyOn(updateAddressStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
