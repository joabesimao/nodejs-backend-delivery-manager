import { InvalidParamError } from "../../errors";
import {
  BarcodeDuplicateValidation,
  BarcodeDuplicateValidator,
} from "./barcode-duplicate-validation";

const makeBarcodeValidatorStub = (): BarcodeDuplicateValidator => {
  class BarcodeDuplicateValidatorStub implements BarcodeDuplicateValidator {
    async validate(barcode: string): Promise<boolean> {
      return false;
    }
  }
  return new BarcodeDuplicateValidatorStub();
};

interface SutTypes {
  sut: BarcodeDuplicateValidation;
  barcodeValidatorStub: BarcodeDuplicateValidator;
}

const makeSut = (): SutTypes => {
  const barcodeValidatorStub = makeBarcodeValidatorStub();
  const sut = new BarcodeDuplicateValidation(barcodeValidatorStub);
  return { sut, barcodeValidatorStub };
};

describe("BarcodeDuplicateValidation", () => {
  test("Should not call BarcodeDuplicateValidator if barcode is absent", async () => {
    const { sut, barcodeValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(barcodeValidatorStub, "validate");
    await sut.validate({});
    expect(validateSpy).not.toHaveBeenCalled();
  });

  test("Should call BarcodeDuplicateValidator with correct barcode", async () => {
    const { sut, barcodeValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(barcodeValidatorStub, "validate");
    await sut.validate({ barcode: "789123" });
    expect(validateSpy).toHaveBeenCalledWith("789123");
  });

  test("Should return InvalidParamError if barcode is duplicate", async () => {
    const { sut, barcodeValidatorStub } = makeSut();
    jest.spyOn(barcodeValidatorStub, "validate").mockReturnValueOnce(Promise.resolve(true));
    const error = await sut.validate({ barcode: "789123" });
    expect(error).toEqual(new InvalidParamError("barcode"));
  });

  test("Should not return if barcode is not duplicate", async () => {
    const { sut } = makeSut();
    const error = await sut.validate({ barcode: "789123" });
    expect(error).toBeFalsy();
  });
});
