import { CpfInUseError } from "../../errors";
import {
  CpfDuplicateValidation,
  CpfDuplicateValidator,
} from "./cpf-duplicate-validation";

const makeCpfValidatorStub = (): CpfDuplicateValidator => {
  class CpfDuplicateValidatorStub implements CpfDuplicateValidator {
    async validate(cpf: string): Promise<boolean> {
      return false;
    }
  }
  return new CpfDuplicateValidatorStub();
};

interface SutTypes {
  sut: CpfDuplicateValidation;
  cpfValidatorStub: CpfDuplicateValidator;
}

const makeSut = (): SutTypes => {
  const cpfValidatorStub = makeCpfValidatorStub();
  const sut = new CpfDuplicateValidation(cpfValidatorStub);
  return { sut, cpfValidatorStub };
};

describe("CpfDuplicateValidation", () => {
  test("Should not call CpfDuplicateValidator if cpf is absent", async () => {
    const { sut, cpfValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(cpfValidatorStub, "validate");
    await sut.validate({});
    expect(validateSpy).not.toHaveBeenCalled();
  });

  test("Should call CpfDuplicateValidator with the cleaned cpf from input.cpf", async () => {
    const { sut, cpfValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(cpfValidatorStub, "validate");
    await sut.validate({ cpf: "123.456.789-00" });
    expect(validateSpy).toHaveBeenCalledWith("12345678900");
  });

  test("Should call CpfDuplicateValidator with the cleaned cpf from input.client.cpf", async () => {
    const { sut, cpfValidatorStub } = makeSut();
    const validateSpy = jest.spyOn(cpfValidatorStub, "validate");
    await sut.validate({ client: { cpf: "123.456.789-00" } });
    expect(validateSpy).toHaveBeenCalledWith("12345678900");
  });

  test("Should return CpfInUseError if cpf is duplicate", async () => {
    const { sut, cpfValidatorStub } = makeSut();
    jest
      .spyOn(cpfValidatorStub, "validate")
      .mockReturnValueOnce(Promise.resolve(true));
    const error = await sut.validate({ cpf: "12345678900" });
    expect(error).toEqual(new CpfInUseError());
  });

  test("Should not return an error if cpf is not duplicate", async () => {
    const { sut } = makeSut();
    const error = await sut.validate({ cpf: "12345678900" });
    expect(error).toBeFalsy();
  });
});
