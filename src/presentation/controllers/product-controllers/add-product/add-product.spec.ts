import {
  AddProduct,
  AddProductModel,
} from "../../../../domain/usescases/product/add-product/add-product";
import { Product } from "../../../../domain/models/product/product";
import { AddProductController } from "./add-product";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { MissingParamError, InvalidParamError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    price: 10,
    description: "any_description",
    category: "any_category",
  },
});

const makeFakeProduct = (): Product => ({
  id: 1,
  name: "any_name",
  price: 10,
  description: "any_description",
  category: "any_category",
  status: true,
});

const makeAddProductStub = (): AddProduct => {
  class AddProductStub implements AddProduct {
    async add(product: AddProductModel): Promise<Product> {
      return new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new AddProductStub();
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
  sut: AddProductController;
  addProductStub: AddProduct;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addProductStub = makeAddProductStub();
  const validationStub = makeValidation();
  const sut = new AddProductController(addProductStub, validationStub);
  return {
    sut,
    addProductStub,
    validationStub,
  };
};

describe("AddProduct Controller", () => {
  test("Should call AddProduct with correct values", async () => {
    const { sut, addProductStub } = makeSut();
    const addSpy = jest.spyOn(addProductStub, "add");
    await sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      price: 10,
      description: "any_description",
      category: "any_category",
    });
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeProduct()));
  });

  test("Should return 500 if AddProduct throws", async () => {
    const { sut, addProductStub } = makeSut();
    jest
      .spyOn(addProductStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if AddProduct throws a duplicate barcode error", async () => {
    const { sut, addProductStub } = makeSut();
    const barcodeError: any = new Error("Unique constraint failed");
    barcodeError.code = "P2002";
    barcodeError.meta = { target: ["barcode"] };
    jest.spyOn(addProductStub, "add").mockReturnValueOnce(Promise.reject(barcodeError));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("barcode")));
  });

  test("Should return 500 if AddProduct throws a P2002 error not related to barcode", async () => {
    const { sut, addProductStub } = makeSut();
    const uniqueError: any = new Error("Unique constraint failed");
    uniqueError.code = "P2002";
    uniqueError.meta = { target: ["name"] };
    jest.spyOn(addProductStub, "add").mockReturnValueOnce(Promise.reject(uniqueError));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(uniqueError));
  });

  test("Should return 500 if AddProduct throws a P2002 error without meta", async () => {
    const { sut, addProductStub } = makeSut();
    const uniqueError: any = new Error("Unique constraint failed");
    uniqueError.code = "P2002";
    jest.spyOn(addProductStub, "add").mockReturnValueOnce(Promise.reject(uniqueError));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(uniqueError));
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
