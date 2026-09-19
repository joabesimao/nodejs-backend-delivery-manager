import { LoadCityController } from "./load-city";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { City } from "../../../../domain/models/city/city-model";
import { LoadCity } from "../../../../domain/usescases/city/load-city";

const makeFakeCityList = (): City[] => [
  {
    id: 1,
    name: "any_name",
  },
  {
    id: 2,
    name: "other_name",
  },
];

interface SutTypes {
  sut: LoadCityController;
  loadCityStub: LoadCity;
}

const makeLoadCityStub = (): LoadCity => {
  class LoadCityStub implements LoadCity {
    async load(): Promise<City[]> {
      return new Promise((resolve) => resolve(makeFakeCityList()));
    }
  }
  return new LoadCityStub();
};

const makeSut = (): SutTypes => {
  const loadCityStub = makeLoadCityStub();
  const sut = new LoadCityController(loadCityStub);
  return {
    sut,
    loadCityStub,
  };
};

describe("LoadCity Controller", () => {
  test("Should call LoadCity with correct values", async () => {
    const { sut, loadCityStub } = makeSut();
    const loadSpy = jest.spyOn(loadCityStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return 500 if LoadCity throws", async () => {
    const { sut, loadCityStub } = makeSut();
    jest
      .spyOn(loadCityStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeCityList()));
  });
});
