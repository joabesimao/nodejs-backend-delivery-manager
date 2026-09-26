import { UpdateDeliverymanController } from "./update-deliveryman";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { MissingParamError } from "../../../errors";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import {
  UpdateDeliveryman,
  UpdateDeliverymanModel,
} from "../../../../domain/usescases/deliveryman/update-deliveryman";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
  body: {
    name: "any_name",
  },
});

const makeFakeDeliveryman = (): Deliveryman => ({
  id: 1,
  name: "any_name",
  lastName: "any_lastName",
  numberQualification: "any_numberQualification",
  phone: "any_phone",
});

const makeUpdateDeliverymanStub = (): UpdateDeliveryman => {
  class UpdateDeliverymanStub implements UpdateDeliveryman {
    async update(
      id: number,
      data: UpdateDeliverymanModel
    ): Promise<Deliveryman> {
      return await new Promise((resolve) => resolve(makeFakeDeliveryman()));
    }
  }
  return new UpdateDeliverymanStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: UpdateDeliverymanController;
  updateDeliverymanStub: UpdateDeliveryman;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const updateDeliverymanStub = makeUpdateDeliverymanStub();
  const validationStub = makeValidation();
  const sut = new UpdateDeliverymanController(
    updateDeliverymanStub,
    validationStub
  );
  return {
    sut,
    updateDeliverymanStub,
    validationStub,
  };
};

describe("UpdateDeliveryman Controller", () => {
  test("Should call UpdateDeliveryman with correct values", async () => {
    const { sut, updateDeliverymanStub } = makeSut();
    const updateSpy = jest.spyOn(updateDeliverymanStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: "any_name",
    });
  });

  test("Should return 500 if UpdateDeliveryman throws", async () => {
    const { sut, updateDeliverymanStub } = makeSut();
    jest
      .spyOn(updateDeliverymanStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeDeliveryman()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("name"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });
});
