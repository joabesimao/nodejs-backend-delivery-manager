import { UpdateProduct } from "../../../../domain/usescases/product/update-product/update-product";
import { Product, ProductModel } from "../../../../domain/models/product/product";
import { UpdateProductController } from "./update-product";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { MissingParamError, InvalidParamError } from "../../../errors";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: 1,
  },
  body: {
    name: "any_name",
    price: 10,
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

const makeUpdateProductStub = (): UpdateProduct => {
  class UpdateProductStub implements UpdateProduct {
    async update(id: number, info: Partial<ProductModel>): Promise<Product> {
      return new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new UpdateProductStub();
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
  sut: UpdateProductController;
  updateProductStub: UpdateProduct;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const updateProductStub = makeUpdateProductStub();
  const validationStub = makeValidation();
  const sut = new UpdateProductController(updateProductStub, validationStub);
  return {
    sut,
    updateProductStub,
    validationStub,
  };
};

describe("UpdateProduct Controller", () => {
  test("Should call UpdateProduct with correct values", async () => {
    const { sut, updateProductStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductStub, "update");
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: "any_name",
      price: 10,
    });
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeProduct()));
  });

  test("Should return 500 if UpdateProduct throws", async () => {
    const { sut, updateProductStub } = makeSut();
    jest
      .spyOn(updateProductStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 400 if UpdateProduct throws a duplicate barcode error", async () => {
    const { sut, updateProductStub } = makeSut();
    const barcodeError: any = new Error("Unique constraint failed");
    barcodeError.code = "P2002";
    barcodeError.meta = { target: ["barcode"] };
    jest.spyOn(updateProductStub, "update").mockReturnValueOnce(Promise.reject(barcodeError));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("barcode")));
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
