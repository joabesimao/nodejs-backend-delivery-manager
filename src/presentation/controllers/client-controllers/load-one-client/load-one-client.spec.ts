import { LoadOneClientController } from "./load-one-client";
import { LoadOneClient } from "../../../../domain/usescases/client/load-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { HttpRequest } from "../../../protocols/http";

const makeFakeOneClient = (): ClientModel => ({
  name: "any_name",
  lastName: "any_last_name",
  phone: "any_number",
});

const fakehttpRequest = (): HttpRequest => ({
  body: {
    id: 1,
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_number",
  },
  params: {
    id: 1,
  },
});

interface SutTypes {
  sut: LoadOneClientController;
  loadOneClientStub: LoadOneClient;
}

const makeLoadOneClient = (): LoadOneClient => {
  class LoadOneClientStub implements LoadOneClient {
    async loadOne(id: number): Promise<ClientModel> {
      return new Promise((resolve) => resolve(makeFakeOneClient()));
    }
  }
  return new LoadOneClientStub();
};

const makeSut = (): SutTypes => {
  const loadOneClientStub = makeLoadOneClient();
  const sut = new LoadOneClientController(loadOneClientStub);
  return {
    sut,
    loadOneClientStub,
  };
};

describe("Load one CLient Controller", () => {
  test("Should call LoadOneClient", async () => {
    const { sut, loadOneClientStub } = makeSut();
    const loadSpy = jest.spyOn(loadOneClientStub, "loadOne");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should call LoadOneClient with correct values", async () => {
    const { sut, loadOneClientStub } = makeSut();
    const loadSpy = jest.spyOn(loadOneClientStub, "loadOne");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalledWith(1);
  });

  test("Should return one client on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeOneClient()));
  });

  test("Should return 500 if LoadOneClient throws", async () => {
    const { sut, loadOneClientStub } = makeSut();
    jest
      .spyOn(loadOneClientStub, "loadOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
