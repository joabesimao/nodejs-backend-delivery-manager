import { MissingParamError } from "../../errors";
import { RequireFieldsValidation } from "./require-field-validation";

describe("Require fields validation", () => {
  test("Should return a MissingParamError if validation fails ", async () => {
    const sut = new RequireFieldsValidation("field");
    const error = sut.validate({
      name: "any_name",
    });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
