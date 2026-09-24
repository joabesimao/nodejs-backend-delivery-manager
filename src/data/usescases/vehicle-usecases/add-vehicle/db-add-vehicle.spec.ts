import { DbAddVehicle } from "./db-add-vehicle";
import { AddVehicleRepository } from "../../../protocols/db/vehicle/add-vehicle";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicleModel } from "../../../../domain/usescases/vehicle/add-vehicle";

interface SutTypes {
  sut: DbAddVehicle;
  addVehicleRepositoryStub: AddVehicleRepository;
}

const makeVehicle = (): Vehicle => ({
  id: 1,
  plate: "ABC1D23",
  model: "any_model",
  brand: "any_brand",
  deliverymanId: 1,
});

const makeAddVehicleModel = (): AddVehicleModel => ({
  plate: "ABC1D23",
  model: "any_model",
  brand: "any_brand",
  deliverymanId: 1,
});

const makeAddVehicleRepository = (): AddVehicleRepository => {
  class AddVehicleRepositoryStub implements AddVehicleRepository {
    async add(vehicle: AddVehicleModel): Promise<Vehicle> {
      return new Promise((resolve) => resolve(makeVehicle()));
    }
  }
  return new AddVehicleRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addVehicleRepositoryStub = makeAddVehicleRepository();
  const sut = new DbAddVehicle(addVehicleRepositoryStub);
  return {
    sut,
    addVehicleRepositoryStub,
  };
};

describe("DbAddVehicle Usecase", () => {
  test("Should call AddVehicleRepository with correct values", async () => {
    const { sut, addVehicleRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addVehicleRepositoryStub, "add");
    await sut.add(makeAddVehicleModel());
    expect(addSpy).toHaveBeenCalledWith(makeAddVehicleModel());
  });

  test("Should throw if AddVehicleRepository throws", async () => {
    const { sut, addVehicleRepositoryStub } = makeSut();
    jest
      .spyOn(addVehicleRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddVehicleModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a Vehicle on success", async () => {
    const { sut } = makeSut();
    const vehicle = await sut.add(makeAddVehicleModel());
    expect(vehicle).toEqual(makeVehicle());
  });
});
