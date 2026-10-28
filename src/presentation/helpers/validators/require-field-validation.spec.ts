import { MissingParamError } from "../../errors";
import { RequireFieldsValidation } from "./require-field-validation";

const makeSut = (): RequireFieldsValidation => {
  return new RequireFieldsValidation("field");
};

describe("Require fields validation", () => {
  test("Should return a MissingParamError if validation fails ", async () => {
    const sut = makeSut();
    const error = sut.validate({
      name: "any_name",
    });
    expect(error).toEqual(new MissingParamError("field"));
  });

  test("Should not return if validation succeeds", async () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_name",
    });
    expect(error).toBeFalsy();
  });

  test.each([null, "", "   "])(
    "Should return a MissingParamError if field is %p",
    (value) => {
      const sut = makeSut();
      expect(sut.validate({ field: value })).toEqual(
        new MissingParamError("field")
      );
    }
  );

  test.each([0, false])("Should not return if field is %p", (value) => {
    const sut = makeSut();
    expect(sut.validate({ field: value })).toBeFalsy();
  });
});
