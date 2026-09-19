import { AddNeighborhoodController } from "./add-neighborhood";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import {
  AddNeighborhood,
  AddNeighborhoodModel,
} from "../../../../domain/usescases/neighborhood/add-neighborhood";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    cityId: 1,
  },
});

const makeFakeNeighborhood = (): Neighborhood => ({
  id: 1,
  name: "any_name",
  cityId: 1,
});

interface SutTypes {
  sut: AddNeighborhoodController;
  addNeighborhoodStub: AddNeighborhood;
}

const makeAddNeighborhoodStub = (): AddNeighborhood => {
  class AddNeighborhoodStub implements AddNeighborhood {
    async add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood> {
      return new Promise((resolve) => resolve(makeFakeNeighborhood()));
    }
  }
  return new AddNeighborhoodStub();
};

const makeSut = (): SutTypes => {
  const addNeighborhoodStub = makeAddNeighborhoodStub();
  const sut = new AddNeighborhoodController(addNeighborhoodStub);
  return {
    sut,
    addNeighborhoodStub,
  };
};

describe("AddNeighborhood Controller", () => {
  test("Should call AddNeighborhood with correct values", async () => {
    const { sut, addNeighborhoodStub } = makeSut();
    const addSpy = jest.spyOn(addNeighborhoodStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      cityId: 1,
    });
  });

  test("Should return 500 if AddNeighborhood throws", async () => {
    const { sut, addNeighborhoodStub } = makeSut();
    jest
      .spyOn(addNeighborhoodStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeNeighborhood()));
  });
});
