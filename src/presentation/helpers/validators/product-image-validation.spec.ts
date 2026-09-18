import { InvalidParamError } from "../../errors";
import { ProductImageValidation } from "./product-image-validation";

const makeSut = (): ProductImageValidation => new ProductImageValidation();

describe("ProductImageValidation", () => {
  test("Should not return if imageBase64 is absent", () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });

  test("Should return InvalidParamError if imageBase64 is not a string", () => {
    const sut = makeSut();
    const error = sut.validate({ imageBase64: 123 });
    expect(error).toEqual(new InvalidParamError("imageBase64"));
  });

  test("Should return InvalidParamError if imageBase64 exceeds the max size", () => {
    const sut = makeSut();
    const oversized = "a".repeat(8 * 1024 * 1024);
    const error = sut.validate({ imageBase64: oversized });
    expect(error).toEqual(new InvalidParamError("imageBase64"));
  });

  test("Should not return if imageBase64 is a valid data URL within the size limit", () => {
    const sut = makeSut();
    const error = sut.validate({ imageBase64: "data:image/png;base64,aGVsbG8=" });
    expect(error).toBeFalsy();
  });
});
