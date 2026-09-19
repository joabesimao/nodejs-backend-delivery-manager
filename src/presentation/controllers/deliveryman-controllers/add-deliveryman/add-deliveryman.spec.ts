import { AddDeliverymanController } from "./add-deliveryman";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { MissingParamError } from "../../../errors";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import {
  AddDeliveryman,
  AddDeliverymanModel,
} from "../../../../domain/usescases/deliveryman/add-deliveryman";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    lastName: "any_lastName",
    numberQualification: "any_numberQualification",
    phone: "any_phone",
  },
});

const makeFakeDeliveryman = (): Deliveryman => ({
  id: 1,
  name: "any_name",
  lastName: "any_lastName",
  numberQualification: "any_numberQualification",
  phone: "any_phone",
});

const makeAddDeliverymanStub = (): AddDeliveryman => {
  class AddDeliverymanStub implements AddDeliveryman {
    async add(deliveryman: AddDeliverymanModel): Promise<Deliveryman> {
      return new Promise((resolve) => resolve(makeFakeDeliveryman()));
    }
  }
  return new AddDeliverymanStub();
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
  sut: AddDeliverymanController;
  addDeliverymanStub: AddDeliveryman;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addDeliverymanStub = makeAddDeliverymanStub();
  const validationStub = makeValidation();
  const sut = new AddDeliverymanController(addDeliverymanStub, validationStub);
  return {
    sut,
    addDeliverymanStub,
    validationStub,
  };
};

describe("AddDeliveryman Controller", () => {
  test("Should call AddDeliveryman with correct values", async () => {
    const { sut, addDeliverymanStub } = makeSut();
    const addSpy = jest.spyOn(addDeliverymanStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      lastName: "any_lastName",
      numberQualification: "any_numberQualification",
      phone: "any_phone",
    });
  });

  test("Should return 500 if AddDeliveryman throws", async () => {
    const { sut, addDeliverymanStub } = makeSut();
    jest
      .spyOn(addDeliverymanStub, "add")
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
