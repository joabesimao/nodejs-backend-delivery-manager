import { LoadOilChangeLogController } from "./load-oil-change-log";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { LoadOilChangeLog, LoadOilChangeLogParams } from "../../../../domain/usescases/oil-change/load-oil-change-log";

const makeFakeRequest = (): HttpRequest => ({ query: { vehicleId: "1" } });

const makeFakeLogs = (): OilChangeLog[] => [
  {
    id: 1,
    vehicleId: 1,
    deliverymanId: 1,
    km: 1000,
    nextChangeKm: 1800,
    changeDate: new Date("2026-09-23T00:00:00.000Z"),
    createdAt: new Date("2026-09-23T00:00:00.000Z"),
  },
];

interface SutTypes {
  sut: LoadOilChangeLogController;
  loadOilChangeLogStub: LoadOilChangeLog;
}

const makeLoadOilChangeLogStub = (): LoadOilChangeLog => {
  class LoadOilChangeLogStub implements LoadOilChangeLog {
    async load(params?: LoadOilChangeLogParams): Promise<OilChangeLog[]> {
      return new Promise((resolve) => resolve(makeFakeLogs()));
    }
  }
  return new LoadOilChangeLogStub();
};

const makeSut = (): SutTypes => {
  const loadOilChangeLogStub = makeLoadOilChangeLogStub();
  const sut = new LoadOilChangeLogController(loadOilChangeLogStub);
  return { sut, loadOilChangeLogStub };
};

describe("LoadOilChangeLog Controller", () => {
  test("Should call LoadOilChangeLog with query params", async () => {
    const { sut, loadOilChangeLogStub } = makeSut();
    const loadSpy = jest.spyOn(loadOilChangeLogStub, "load");
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should return 500 if LoadOilChangeLog throws", async () => {
    const { sut, loadOilChangeLogStub } = makeSut();
    jest
      .spyOn(loadOilChangeLogStub, "load")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 with logs on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeLogs()));
  });
});
