import { LoadOilChangeConfigController } from "./load-oil-change-config";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { LoadOilChangeConfig } from "../../../../domain/usescases/oil-change/load-oil-change-config";

const makeFakeRequest = (): HttpRequest => ({});

const makeFakeConfig = (): OilChangeConfig => ({ id: 1, intervalKm: 800, updatedAt: new Date("2026-09-23T00:00:00.000Z") });

interface SutTypes {
  sut: LoadOilChangeConfigController;
  loadOilChangeConfigStub: LoadOilChangeConfig;
}

const makeLoadOilChangeConfigStub = (): LoadOilChangeConfig => {
  class LoadOilChangeConfigStub implements LoadOilChangeConfig {
    async load(): Promise<OilChangeConfig> {
      return new Promise((resolve) => resolve(makeFakeConfig()));
    }
  }
  return new LoadOilChangeConfigStub();
};

const makeSut = (): SutTypes => {
  const loadOilChangeConfigStub = makeLoadOilChangeConfigStub();
  const sut = new LoadOilChangeConfigController(loadOilChangeConfigStub);
  return { sut, loadOilChangeConfigStub };
};

describe("LoadOilChangeConfig Controller", () => {
  test("Should return 500 if LoadOilChangeConfig throws", async () => {
    const { sut, loadOilChangeConfigStub } = makeSut();
    jest
      .spyOn(loadOilChangeConfigStub, "load")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 with config on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeConfig()));
  });
});
