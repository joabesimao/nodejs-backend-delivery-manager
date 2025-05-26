import { UpdateClientController } from "./update-client-controller";
import { UpdateClient } from "../../../../domain/usescases/client/update-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import {
  Client,
  ClientModel,
} from "../../../../domain/models/client/client-model";
import { HttpRequest } from "../../../protocols/http";

const makeFakeUpdateClient = (): ClientModel => ({
  name: "any_name",
  lastName: "any_last_name",
  phone: "any_number",
});

const fakehttpRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_number",
  },
  params: {
    id: 1,
  },
});

interface SutTypes {
  sut: UpdateClientController;
  updateClientStub: UpdateClient;
}

const makeUpdateClient = (): UpdateClient => {
  class UpdateClientStub implements UpdateClient {
    async update(id: number, infoToUpdate: ClientModel): Promise<Client> {
      return new Promise((resolve) => resolve(makeFakeUpdateClient()));
    }
  }
  return new UpdateClientStub();
};

const makeSut = (): SutTypes => {
  const updateClientStub = makeUpdateClient();
  const sut = new UpdateClientController(updateClientStub);
  return {
    sut,
    updateClientStub,
  };
};

describe("Load update client Controller", () => {
  test("Should call UpdateClient", async () => {
    const { sut, updateClientStub } = makeSut();
    const loadSpy = jest.spyOn(updateClientStub, "update");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should call updateClient with correct values", async () => {
    const { sut, updateClientStub } = makeSut();
    const loadSpy = jest.spyOn(updateClientStub, "update");
    await sut.handle(fakehttpRequest());
    expect(loadSpy).toHaveBeenCalledWith(1, {
      lastName: "any_last_name",
      name: "any_name",
      phone: "any_number",
    });
  });

  test("Should return update client on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeUpdateClient()));
  });

  test("Should return 500 if UpdateClient throws", async () => {
    const { sut, updateClientStub } = makeSut();
    jest
      .spyOn(updateClientStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
