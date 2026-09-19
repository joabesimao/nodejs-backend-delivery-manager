import { DbLoadNeighborhood } from "./db-load-neighborhood";
import { LoadNeighborhoodRepository } from "../../../protocols/db/neighborhood/load-neighborhood";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";

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
  sut: DbLoadNeighborhood;
  loadNeighborhoodRepositoryStub: LoadNeighborhoodRepository;
}

const makeLoadNeighborhoodRepository = (): LoadNeighborhoodRepository => {
  class LoadNeighborhoodRepositoryStub
    implements LoadNeighborhoodRepository
  {
    async loadAll(): Promise<Neighborhood[]> {
      return new Promise((resolve) => resolve(makeFakeNeighborhoodList()));
    }
  }
  return new LoadNeighborhoodRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadNeighborhoodRepositoryStub = makeLoadNeighborhoodRepository();
  const sut = new DbLoadNeighborhood(loadNeighborhoodRepositoryStub);
  return {
    sut,
    loadNeighborhoodRepositoryStub,
  };
};

describe("DbLoadNeighborhood Usecase", () => {
  test("Should call LoadNeighborhoodRepository", async () => {
    const { sut, loadNeighborhoodRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadNeighborhoodRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should throw if LoadNeighborhoodRepository throws", async () => {
    const { sut, loadNeighborhoodRepositoryStub } = makeSut();
    jest
      .spyOn(loadNeighborhoodRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of Neighborhood on success", async () => {
    const { sut } = makeSut();
    const neighborhoods = await sut.load();
    expect(neighborhoods).toEqual(makeFakeNeighborhoodList());
  });
});
