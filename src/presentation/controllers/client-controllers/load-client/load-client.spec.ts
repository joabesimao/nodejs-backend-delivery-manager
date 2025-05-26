import { LoadClientController } from "./load-client";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { LoadClients } from "../../../../domain/usescases/client/load-client";

const makeFakeClientList = (): ClientModel[] => {
  return [
    {
      name: "any_name",
      lastName: "any_last_name",
      phone: "any_number",
    },

    {
      name: "other_name",
      lastName: "other_last_name",
      phone: "other_number",
    },
  ];
};

interface SutTypes {
  sut: LoadClientController;
  loadClientStub: LoadClients;
}

const makeLoadClient = (): LoadClients => {
  class LoadClientStub implements LoadClients {
    async load(): Promise<ClientModel[]> {
      return new Promise((resolve) => resolve(makeFakeClientList()));
    }
  }
  return new LoadClientStub();
};

const makeSut = (): SutTypes => {
  const loadClientStub = makeLoadClient();
  const sut = new LoadClientController(loadClientStub);
  return {
    sut,
    loadClientStub,
  };
};

describe("Load CLient Controller", () => {
  test("Should call LoadClient", async () => {
    const { sut, loadClientStub } = makeSut();
    const loadSpy = jest.spyOn(loadClientStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return a list of client and return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeClientList()));
  });

  test("Should return 204 if LoadRegister returns empty", async () => {
    const { sut, loadClientStub } = makeSut();
    jest
      .spyOn(loadClientStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 500 if LoadRegister throws", async () => {
    const { sut, loadClientStub } = makeSut();
    jest
      .spyOn(loadClientStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
