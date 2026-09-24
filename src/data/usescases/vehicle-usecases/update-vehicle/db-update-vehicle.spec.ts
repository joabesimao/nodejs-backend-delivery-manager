import { DbUpdateVehicle } from "./db-update-vehicle";
import { UpdateVehicleRepository } from "../../../protocols/db/vehicle/update-vehicle";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";

interface SutTypes {
  sut: DbUpdateVehicle;
  updateVehicleRepositoryStub: UpdateVehicleRepository;
}

const makeVehicle = (): Vehicle => ({
  id: 1,
  plate: "ABC1D23",
  model: "any_model",
  brand: "any_brand",
  deliverymanId: 1,
});

const makeUpdateVehicleRepository = (): UpdateVehicleRepository => {
  class UpdateVehicleRepositoryStub implements UpdateVehicleRepository {
    async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
      return new Promise((resolve) => resolve(makeVehicle()));
    }
  }
  return new UpdateVehicleRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateVehicleRepositoryStub = makeUpdateVehicleRepository();
  const sut = new DbUpdateVehicle(updateVehicleRepositoryStub);
  return {
    sut,
    updateVehicleRepositoryStub,
  };
};

describe("DbUpdateVehicle Usecase", () => {
  test("Should call UpdateVehicleRepository with correct values", async () => {
    const { sut, updateVehicleRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateVehicleRepositoryStub, "update");
    await sut.update(1, { plate: "new_plate" });
    expect(updateSpy).toHaveBeenCalledWith(1, { plate: "new_plate" });
  });

  test("Should throw if UpdateVehicleRepository throws", async () => {
    const { sut, updateVehicleRepositoryStub } = makeSut();
    jest
      .spyOn(updateVehicleRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(1, { plate: "new_plate" });
    await expect(promise).rejects.toThrow();
  });

  test("Should return an updated vehicle on success", async () => {
    const { sut } = makeSut();
    const vehicle = await sut.update(1, { plate: "new_plate" });
    expect(vehicle).toEqual(makeVehicle());
  });
});
