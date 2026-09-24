import { PlateInUseError } from "../../errors";
import {
  PlateDuplicateValidation,
  PlateDuplicateValidator,
} from "./plate-duplicate-validation";

const makePlateValidatorStub = (): PlateDuplicateValidator => {
  class PlateDuplicateValidatorStub implements PlateDuplicateValidator {
    async validate(plate: string): Promise<boolean> {
      return false;
    }
  }
  return new PlateDuplicateValidatorStub();
};

interface SutTypes {
  sut: PlateDuplicateValidation;
  plateValidatorStub: PlateDuplicateValidator;
}

const makeSut = (): SutTypes => {
  const plateValidatorStub = makePlateValidatorStub();
  const sut = new PlateDuplicateValidation(plateValidatorStub);
  return { sut, plateValidatorStub };
};

describe("PlateDuplicateValidation", () => {
  test("Should not call PlateDuplicateValidator if plate is absent", async () => {
    const { sut, plateValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(plateValidatorStub, "validate");
    await sut.validate({});
    expect(validateSpy).not.toHaveBeenCalled();
  });

  test("Should call PlateDuplicateValidator with the provided plate", async () => {
    const { sut, plateValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(plateValidatorStub, "validate");
    await sut.validate({ plate: "ABC1D23" });
    expect(validateSpy).toHaveBeenCalledWith("ABC1D23");
  });

  test("Should return PlateInUseError if plate is duplicate", async () => {
    const { sut, plateValidatorStub } = makeSut();
    jest
      .spyOn(plateValidatorStub, "validate")
      .mockReturnValueOnce(Promise.resolve(true));
    const error = await sut.validate({ plate: "ABC1D23" });
    expect(error).toEqual(new PlateInUseError());
  });

  test("Should not return an error if plate is not duplicate", async () => {
    const { sut } = makeSut();
    const error = await sut.validate({ plate: "ABC1D23" });
    expect(error).toBeFalsy();
  });
});
