import { UpdateNeighborhoodController } from "./update-neighborhood";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import {
  UpdateNeighborhood,
  UpdateNeighborhoodModel,
} from "../../../../domain/usescases/neighborhood/update-neighborhood";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
  body: {
    name: "any_name",
  },
});

const makeFakeNeighborhood = (): Neighborhood => ({
  id: 1,
  name: "any_name",
  cityId: 1,
});

interface SutTypes {
  sut: UpdateNeighborhoodController;
  updateNeighborhoodStub: UpdateNeighborhood;
}

const makeUpdateNeighborhoodStub = (): UpdateNeighborhood => {
  class UpdateNeighborhoodStub implements UpdateNeighborhood {
    async update(
      id: number,
      data: UpdateNeighborhoodModel
    ): Promise<Neighborhood> {
      return await new Promise((resolve) => resolve(makeFakeNeighborhood()));
    }
  }
  return new UpdateNeighborhoodStub();
};

const makeSut = (): SutTypes => {
  const updateNeighborhoodStub = makeUpdateNeighborhoodStub();
  const sut = new UpdateNeighborhoodController(updateNeighborhoodStub);
  return {
    sut,
    updateNeighborhoodStub,
  };
};

describe("UpdateNeighborhood Controller", () => {
  test("Should call UpdateNeighborhood with correct values", async () => {
    const { sut, updateNeighborhoodStub } = makeSut();
    const updateSpy = jest.spyOn(updateNeighborhoodStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: "any_name",
    });
  });

  test("Should return 500 if UpdateNeighborhood throws", async () => {
    const { sut, updateNeighborhoodStub } = makeSut();
    jest
      .spyOn(updateNeighborhoodStub, "update")
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
