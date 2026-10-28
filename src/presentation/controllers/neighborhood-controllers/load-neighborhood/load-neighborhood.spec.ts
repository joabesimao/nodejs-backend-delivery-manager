import { LoadNeighborhoodController } from "./load-neighborhood";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { LoadNeighborhood } from "../../../../domain/usescases/neighborhood/load-neighborhood";

const makeFakeNeighborhoodList = (): Neighborhood[] => [
  {
    id: 1,
    name: "any_name",
    cityId: 1,
  },
  {
    id: 2,
    name: "other_name",
    cityId: 2,
  },
];

interface SutTypes {
  sut: LoadNeighborhoodController;
  loadNeighborhoodStub: LoadNeighborhood;
}

const makeLoadNeighborhoodStub = (): LoadNeighborhood => {
  class LoadNeighborhoodStub implements LoadNeighborhood {
    async load(): Promise<Neighborhood[]> {
      return await new Promise((resolve) => resolve(makeFakeNeighborhoodList()));
    }
  }
  return new LoadNeighborhoodStub();
};

const makeSut = (): SutTypes => {
  const loadNeighborhoodStub = makeLoadNeighborhoodStub();
  const sut = new LoadNeighborhoodController(loadNeighborhoodStub);
  return {
    sut,
    loadNeighborhoodStub,
  };
};

describe("LoadNeighborhood Controller", () => {
  test("Should call LoadNeighborhood with correct values", async () => {
    const { sut, loadNeighborhoodStub } = makeSut();
    const loadSpy = jest.spyOn(loadNeighborhoodStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return 500 if LoadNeighborhood throws", async () => {
    const { sut, loadNeighborhoodStub } = makeSut();
    jest
      .spyOn(loadNeighborhoodStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeNeighborhoodList()));
  });
});
