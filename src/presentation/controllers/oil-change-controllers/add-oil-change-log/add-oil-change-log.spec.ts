import { AddOilChangeLogController } from "./add-oil-change-log";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddOilChangeLog, AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { Validation } from "../../../protocols/validation";
import { MissingParamError, InvalidKmError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    vehicleId: 1,
    deliverymanId: 1,
    km: 1000,
    changeDate: "2026-09-23",
  },
});

const makeFakeOilChangeLog = (): OilChangeLog => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  nextChangeKm: 1800,
  changeDate: new Date("2026-09-23"),
  createdAt: new Date("2026-09-23"),
});

interface SutTypes {
  sut: AddOilChangeLogController;
  addOilChangeLogStub: AddOilChangeLog;
  validationStub: Validation;
}

const makeAddOilChangeLogStub = (): AddOilChangeLog => {
  class AddOilChangeLogStub implements AddOilChangeLog {
    async add(log: AddOilChangeLogModel): Promise<OilChangeLog> {
      return new Promise((resolve) => resolve(makeFakeOilChangeLog()));
    }
  }
  return new AddOilChangeLogStub();
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
  const addOilChangeLogStub = makeAddOilChangeLogStub();
  const validationStub = makeValidationStub();
  const sut = new AddOilChangeLogController(addOilChangeLogStub, validationStub);
  return { sut, addOilChangeLogStub, validationStub };
};

describe("AddOilChangeLog Controller", () => {
  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("km"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("km")));
  });

  test("Should call AddOilChangeLog with correct values", async () => {
    const { sut, addOilChangeLogStub } = makeSut();
    const addSpy = jest.spyOn(addOilChangeLogStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      vehicleId: 1,
      deliverymanId: 1,
      km: 1000,
      changeDate: new Date("2026-09-23"),
    });
  });

  test("Should return 400 if AddOilChangeLog throws InvalidKmError", async () => {
    const { sut, addOilChangeLogStub } = makeSut();
    jest
      .spyOn(addOilChangeLogStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new InvalidKmError())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidKmError()));
  });

  test("Should return 500 if AddOilChangeLog throws", async () => {
    const { sut, addOilChangeLogStub } = makeSut();
    jest
      .spyOn(addOilChangeLogStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeOilChangeLog()));
  });
});
