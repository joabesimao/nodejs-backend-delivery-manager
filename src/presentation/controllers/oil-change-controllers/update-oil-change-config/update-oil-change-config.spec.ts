import { UpdateOilChangeConfigController } from "./update-oil-change-config";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { UpdateOilChangeConfig, UpdateOilChangeConfigModel } from "../../../../domain/usescases/oil-change/update-oil-change-config";
import { Validation } from "../../../protocols/validation";
import { MissingParamError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({ body: { intervalKm: 1000 } });

const makeFakeConfig = (): OilChangeConfig => ({ id: 1, intervalKm: 1000, updatedAt: new Date("2026-09-23T00:00:00.000Z") });

interface SutTypes {
  sut: UpdateOilChangeConfigController;
  updateOilChangeConfigStub: UpdateOilChangeConfig;
  validationStub: Validation;
}

const makeUpdateOilChangeConfigStub = (): UpdateOilChangeConfig => {
  class UpdateOilChangeConfigStub implements UpdateOilChangeConfig {
    async update(data: UpdateOilChangeConfigModel): Promise<OilChangeConfig> {
      return await new Promise((resolve) => resolve(makeFakeConfig()));
    }
  }
  return new UpdateOilChangeConfigStub();
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
  const updateOilChangeConfigStub = makeUpdateOilChangeConfigStub();
  const validationStub = makeValidationStub();
  const sut = new UpdateOilChangeConfigController(updateOilChangeConfigStub, validationStub);
  return { sut, updateOilChangeConfigStub, validationStub };
};

describe("UpdateOilChangeConfig Controller", () => {
  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("intervalKm"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("intervalKm")));
  });

  test("Should call UpdateOilChangeConfig with correct values", async () => {
    const { sut, updateOilChangeConfigStub } = makeSut();
    const updateSpy = jest.spyOn(updateOilChangeConfigStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith({ intervalKm: 1000 });
  });

  test("Should return 500 if UpdateOilChangeConfig throws", async () => {
    const { sut, updateOilChangeConfigStub } = makeSut();
    jest
      .spyOn(updateOilChangeConfigStub, "update")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeConfig()));
  });
});
