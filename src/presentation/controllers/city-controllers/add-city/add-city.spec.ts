import { AddCityController } from "./add-city";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { City } from "../../../../domain/models/city/city-model";
import {
  AddCity,
  AddCityModel,
} from "../../../../domain/usescases/city/add-city";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
  },
});

const makeFakeCity = (): City => ({
  id: 1,
  name: "any_name",
});

interface SutTypes {
  sut: AddCityController;
  addCityStub: AddCity;
}

const makeAddCityStub = (): AddCity => {
  class AddCityStub implements AddCity {
    async add(city: AddCityModel): Promise<City> {
      return await new Promise((resolve) => resolve(makeFakeCity()));
    }
  }
  return new AddCityStub();
};

const makeSut = (): SutTypes => {
  const addCityStub = makeAddCityStub();
  const sut = new AddCityController(addCityStub);
  return {
    sut,
    addCityStub,
  };
};

describe("AddCity Controller", () => {
  test("Should call AddCity with correct values", async () => {
    const { sut, addCityStub } = makeSut();
    const addSpy = jest.spyOn(addCityStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
    });
  });

  test("Should return 500 if AddCity throws", async () => {
    const { sut, addCityStub } = makeSut();
    jest
      .spyOn(addCityStub, "add")
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
