import { InvalidParamError } from "../../errors";
import { OptionalFieldTypeValidation } from "./optional-field-type-validation";

describe("OptionalFieldTypeValidation", () => {
  describe("string field", () => {
    const makeSut = (): OptionalFieldTypeValidation =>
      new OptionalFieldTypeValidation("name", "string");

    test("Should not return if field is absent", () => {
      const sut = makeSut();
      const error = sut.validate({});
      expect(error).toBeFalsy();
    });

    test("Should return InvalidParamError if field is not a string", () => {
      const sut = makeSut();
      const error = sut.validate({ name: 123 });
      expect(error).toEqual(new InvalidParamError("name"));
    });

    test("Should return InvalidParamError if field is an empty string", () => {
      const sut = makeSut();
      const error = sut.validate({ name: "   " });
      expect(error).toEqual(new InvalidParamError("name"));
    });

    test("Should not return if field is a valid string", () => {
      const sut = makeSut();
      const error = sut.validate({ name: "any_name" });
      expect(error).toBeFalsy();
    });
  });

  describe("number field", () => {
    const makeSut = (): OptionalFieldTypeValidation =>
      new OptionalFieldTypeValidation("price", "number");

    test("Should not return if field is absent", () => {
      const sut = makeSut();
      const error = sut.validate({});
      expect(error).toBeFalsy();
    });

    test("Should return InvalidParamError if field is not a number", () => {
      const sut = makeSut();
      const error = sut.validate({ price: "10" });
      expect(error).toEqual(new InvalidParamError("price"));
    });

    test("Should return InvalidParamError if field is not positive", () => {
      const sut = makeSut();
      const error = sut.validate({ price: -5 });
      expect(error).toEqual(new InvalidParamError("price"));
    });

    test("Should not return if field is a valid number", () => {
      const sut = makeSut();
      const error = sut.validate({ price: 10 });
      expect(error).toBeFalsy();
    });
  });

  describe("boolean field", () => {
    const makeSut = (): OptionalFieldTypeValidation =>
      new OptionalFieldTypeValidation("status", "boolean");

    test("Should not return if field is absent", () => {
      const sut = makeSut();
      const error = sut.validate({});
      expect(error).toBeFalsy();
    });

    test("Should return InvalidParamError if field is not a boolean", () => {
      const sut = makeSut();
      const error = sut.validate({ status: "true" });
      expect(error).toEqual(new InvalidParamError("status"));
    });

    test("Should not return if field is a valid boolean", () => {
      const sut = makeSut();
      const error = sut.validate({ status: false });
      expect(error).toBeFalsy();
    });
  });
});
