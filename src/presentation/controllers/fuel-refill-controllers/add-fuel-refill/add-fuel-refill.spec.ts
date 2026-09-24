import { AddFuelRefillController } from "./add-fuel-refill";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefill, AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { Validation } from "../../../protocols/validation";
import { MissingParamError, InvalidKmError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    vehicleId: 1,
    deliverymanId: 1,
    km: 1000,
    liters: 20,
    totalValue: 150,
    refillDate: "2026-09-23",
  },
});

const makeFakeFuelRefill = (): FuelRefill => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  liters: 20,
  totalValue: 150,
  refillDate: new Date("2026-09-23"),
  createdAt: new Date("2026-09-23"),
});

interface SutTypes {
  sut: AddFuelRefillController;
  addFuelRefillStub: AddFuelRefill;
  validationStub: Validation;
}

const makeAddFuelRefillStub = (): AddFuelRefill => {
  class AddFuelRefillStub implements AddFuelRefill {
    async add(refill: AddFuelRefillModel): Promise<FuelRefill> {
      return new Promise((resolve) => resolve(makeFakeFuelRefill()));
    }
  }
  return new AddFuelRefillStub();
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
  const addFuelRefillStub = makeAddFuelRefillStub();
  const validationStub = makeValidationStub();
  const sut = new AddFuelRefillController(addFuelRefillStub, validationStub);
  return { sut, addFuelRefillStub, validationStub };
};

describe("AddFuelRefill Controller", () => {
  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("km"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("km")));
  });

  test("Should call AddFuelRefill with correct values", async () => {
    const { sut, addFuelRefillStub } = makeSut();
    const addSpy = jest.spyOn(addFuelRefillStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      vehicleId: 1,
      deliverymanId: 1,
      km: 1000,
      liters: 20,
      totalValue: 150,
      refillDate: new Date("2026-09-23"),
    });
  });

  test("Should return 400 if AddFuelRefill throws InvalidKmError", async () => {
    const { sut, addFuelRefillStub } = makeSut();
    jest
      .spyOn(addFuelRefillStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new InvalidKmError())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidKmError()));
  });

  test("Should return 500 if AddFuelRefill throws", async () => {
    const { sut, addFuelRefillStub } = makeSut();
    jest
      .spyOn(addFuelRefillStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeFuelRefill()));
  });
});
