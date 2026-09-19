import { DbUpdateNeighborhood } from "./db-update-neighborhood";
import { UpdateNeighborhoodRepository } from "../../../protocols/db/neighborhood/update-neighborhood";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { UpdateNeighborhoodModel } from "../../../../domain/usescases/neighborhood/update-neighborhood";

const makeFakeNeighborhood = (): Neighborhood => ({
  id: 1,
  name: "any_name",
  cityId: 1,
});

interface SutTypes {
  sut: DbUpdateNeighborhood;
  updateNeighborhoodRepositoryStub: UpdateNeighborhoodRepository;
}

const makeUpdateNeighborhoodRepository = (): UpdateNeighborhoodRepository => {
  class UpdateNeighborhoodRepositoryStub
    implements UpdateNeighborhoodRepository
  {
    async update(
      id: number,
      data: Partial<Neighborhood>
    ): Promise<Neighborhood> {
      return new Promise((resolve) => resolve(makeFakeNeighborhood()));
    }
  }
  return new UpdateNeighborhoodRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateNeighborhoodRepositoryStub = makeUpdateNeighborhoodRepository();
  const sut = new DbUpdateNeighborhood(updateNeighborhoodRepositoryStub);
  return {
    sut,
    updateNeighborhoodRepositoryStub,
  };
};

describe("DbUpdateNeighborhood Usecase", () => {
  const id = 1;
  const data: UpdateNeighborhoodModel = { name: "any_name" };

  test("Should call UpdateNeighborhoodRepository with correct values", async () => {
    const { sut, updateNeighborhoodRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateNeighborhoodRepositoryStub, "update");
    await sut.update(id, data);
    expect(updateSpy).toHaveBeenCalledWith(1, { name: "any_name" });
  });

  test("Should throw if UpdateNeighborhoodRepository throws", async () => {
    const { sut, updateNeighborhoodRepositoryStub } = makeSut();
    jest
      .spyOn(updateNeighborhoodRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, data);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a Neighborhood on success", async () => {
    const { sut } = makeSut();
    const neighborhood = await sut.update(id, data);
    expect(neighborhood).toEqual(makeFakeNeighborhood());
  });
});
