import { AddVehicleController } from "./add-vehicle";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicle, AddVehicleModel } from "../../../../domain/usescases/vehicle/add-vehicle";
import { Validation } from "../../../protocols/validation";
import { MissingParamError } from "../../../errors";
import { PlateInUseError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    plate: "ABC1D23",
    model: "any_model",
  },
});

const makeFakeVehicle = (): Vehicle => ({
  id: 1,
  plate: "ABC1D23",
  model: "any_model",
});

interface SutTypes {
  sut: AddVehicleController;
  addVehicleStub: AddVehicle;
  validationStub: Validation;
}

const makeAddVehicleStub = (): AddVehicle => {
  class AddVehicleStub implements AddVehicle {
    async add(vehicle: AddVehicleModel): Promise<Vehicle> {
      return new Promise((resolve) => resolve(makeFakeVehicle()));
    }
  }
  return new AddVehicleStub();
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
  const addVehicleStub = makeAddVehicleStub();
  const validationStub = makeValidationStub();
  const sut = new AddVehicleController(addVehicleStub, validationStub);
  return {
    sut,
    addVehicleStub,
    validationStub,
  };
};

describe("AddVehicle Controller", () => {
  test("Should call Validation with correct values", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

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

  test("Should call AddVehicle with correct values", async () => {
    const { sut, addVehicleStub } = makeSut();
    const addSpy = jest.spyOn(addVehicleStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });

  test("Should return 500 if AddVehicle throws", async () => {
    const { sut, addVehicleStub } = makeSut();
    jest
      .spyOn(addVehicleStub, "add")
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
