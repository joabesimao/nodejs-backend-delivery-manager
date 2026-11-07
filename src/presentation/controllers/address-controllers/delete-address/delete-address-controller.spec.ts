import { DeleteAddressController } from "./delete-address-controlller";
import { conflict, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { DeleteAddress } from "../../../../domain/usescases/address/delete-address";
import { HttpRequest } from "../../../protocols/http";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {},
    params: {
      id: 1,
    },
  };
};

interface SutTypes {
  sut: DeleteAddressController;
  deleteAddressStub: DeleteAddress;
}

const makeDeleteAddress = (): DeleteAddress => {
  class DeleteAddressStub implements DeleteAddress {
    async delete(id: number): Promise<string> {
      return await new Promise((resolve) => resolve("Endereço Apagado com Sucesso!"));
    }
  }
  return new DeleteAddressStub();
};

const makeSut = (): SutTypes => {
  const deleteAddressStub = makeDeleteAddress();
  const sut = new DeleteAddressController(deleteAddressStub);
  return {
    sut,
    deleteAddressStub,
  };
};

describe("Delete Address Controller", () => {
  test("Should call DeleteAddress", async () => {
    const { sut, deleteAddressStub } = makeSut();
    const loadSpy = jest.spyOn(deleteAddressStub, "delete");
    await sut.handle(makeFakeHttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should call DeleteAddress with correct values", async () => {
    const { sut, deleteAddressStub } = makeSut();
    const loadSpy = jest.spyOn(deleteAddressStub, "delete");
    await sut.handle(makeFakeHttpRequest());
    expect(loadSpy).toHaveBeenCalledWith(1);
  });

  test("Should delete a Address and return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(ok("Endereço Apagado com Sucesso!"));
  });

  test("Should return 500 if DeleteAddress throws", async () => {
    const { sut, deleteAddressStub } = makeSut();
    jest
      .spyOn(deleteAddressStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return noExists if DeleteAddress throws NotFoundError", async () => {
    const { sut, deleteAddressStub } = makeSut();
    const notFoundError = new NotFoundError();
    jest
      .spyOn(deleteAddressStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(notFoundError))
      );

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(noExists());
  });

  test("Should return conflict if DeleteAddress throws ResourceInUseError", async () => {
    const { sut, deleteAddressStub } = makeSut();
    const resourceInUseError = new ResourceInUseError();
    jest
      .spyOn(deleteAddressStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(resourceInUseError))
      );

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(conflict(resourceInUseError));
  });
});
