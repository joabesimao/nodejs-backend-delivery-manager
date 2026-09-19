import { DbAddNeighborhood } from "./db-add-neighborhood";
import { AddNeighborhoodRepository } from "../../../protocols/db/neighborhood/add-neighborhood";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { AddNeighborhoodModel } from "../../../../domain/usescases/neighborhood/add-neighborhood";

interface SutTypes {
  sut: DbAddNeighborhood;
  addNeighborhoodRepositoryStub: AddNeighborhoodRepository;
}

const makeNeighborhood = (): Neighborhood => ({
  id: 1,
  name: "any_name",
  cityId: 1,
});

const makeAddNeighborhoodModel = (): AddNeighborhoodModel => ({
  name: "any_name",
  cityId: 1,
});

const makeAddNeighborhoodRepository = (): AddNeighborhoodRepository => {
  class AddNeighborhoodRepositoryStub implements AddNeighborhoodRepository {
    async add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood> {
      return new Promise((resolve) => resolve(makeNeighborhood()));
    }
  }
  return new AddNeighborhoodRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addNeighborhoodRepositoryStub = makeAddNeighborhoodRepository();
  const sut = new DbAddNeighborhood(addNeighborhoodRepositoryStub);
  return {
    sut,
    addNeighborhoodRepositoryStub,
  };
};

describe("DbAddNeighborhood Usecase", () => {
  test("Should call AddNeighborhoodRepository with correct values", async () => {
    const { sut, addNeighborhoodRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addNeighborhoodRepositoryStub, "add");
    await sut.add(makeAddNeighborhoodModel());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      cityId: 1,
    });
  });

  test("Should throw if AddNeighborhoodRepository throws", async () => {
    const { sut, addNeighborhoodRepositoryStub } = makeSut();
    jest
      .spyOn(addNeighborhoodRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddNeighborhoodModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a Neighborhood on success", async () => {
    const { sut } = makeSut();
    const neighborhood = await sut.add(makeAddNeighborhoodModel());
    expect(neighborhood).toEqual(makeNeighborhood());
  });
});
