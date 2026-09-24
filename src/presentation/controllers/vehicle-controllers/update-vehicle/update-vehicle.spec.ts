import { UpdateVehicleController } from "./update-vehicle";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { UpdateVehicle, UpdateVehicleModel } from "../../../../domain/usescases/vehicle/update-vehicle";
import { Validation } from "../../../protocols/validation";
import { MissingParamError, PlateInUseError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  params: { id: "1" },
  body: { plate: "new_plate" },
});

const makeFakeVehicle = (): Vehicle => ({
  id: 1,
  plate: "new_plate",
  model: "any_model",
});

interface SutTypes {
  sut: UpdateVehicleController;
  updateVehicleStub: UpdateVehicle;
  validationStub: Validation;
}

const makeUpdateVehicleStub = (): UpdateVehicle => {
  class UpdateVehicleStub implements UpdateVehicle {
    async update(id: number, data: UpdateVehicleModel): Promise<Vehicle> {
      return new Promise((resolve) => resolve(makeFakeVehicle()));
    }
  }
  return new UpdateVehicleStub();
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const updateVehicleStub = makeUpdateVehicleStub();
  const validationStub = makeValidationStub();
  const sut = new UpdateVehicleController(updateVehicleStub, validationStub);
  return {
    sut,
    updateVehicleStub,
    validationStub,
  };
};

describe("UpdateVehicle Controller", () => {
  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("plate"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("plate")));
  });

  test("Should return 409 if Validation returns a PlateInUseError", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new PlateInUseError());
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(conflict(new PlateInUseError()));
  });

  test("Should call UpdateVehicle with correct values", async () => {
    const { sut, updateVehicleStub } = makeSut();
    const updateSpy = jest.spyOn(updateVehicleStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, { plate: "new_plate" });
  });

  test("Should return 500 if UpdateVehicle throws", async () => {
    const { sut, updateVehicleStub } = makeSut();
    jest
      .spyOn(updateVehicleStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeVehicle()));
  });
});
