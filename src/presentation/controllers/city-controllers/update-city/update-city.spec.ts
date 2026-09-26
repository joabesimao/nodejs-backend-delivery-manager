import { UpdateCityController } from "./update-city";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { City } from "../../../../domain/models/city/city-model";
import {
  UpdateCity,
  UpdateCityModel,
} from "../../../../domain/usescases/city/update-city";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
  body: {
    name: "any_name",
  },
});

const makeFakeCity = (): City => ({
  id: 1,
  name: "any_name",
});

interface SutTypes {
  sut: UpdateCityController;
  updateCityStub: UpdateCity;
}

const makeUpdateCityStub = (): UpdateCity => {
  class UpdateCityStub implements UpdateCity {
    async update(id: number, data: UpdateCityModel): Promise<City> {
      return await new Promise((resolve) => resolve(makeFakeCity()));
    }
  }
  return new UpdateCityStub();
};

const makeSut = (): SutTypes => {
  const updateCityStub = makeUpdateCityStub();
  const sut = new UpdateCityController(updateCityStub);
  return {
    sut,
    updateCityStub,
  };
};

describe("UpdateCity Controller", () => {
  test("Should call UpdateCity with correct values", async () => {
    const { sut, updateCityStub } = makeSut();
    const updateSpy = jest.spyOn(updateCityStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: "any_name",
    });
  });

  test("Should return 500 if UpdateCity throws", async () => {
    const { sut, updateCityStub } = makeSut();
    jest
      .spyOn(updateCityStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeCity()));
  });
});
