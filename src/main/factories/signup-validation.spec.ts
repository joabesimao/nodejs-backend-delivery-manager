import { ValidationComposite } from "../../presentation/helpers/validator/validation-composite";
import { makeSignupValidation } from "./signup-validation";
import { RequireFieldsValidation } from "../../presentation/helpers/validator/require-field-validation";
import { CompareFieldsValidation } from "../../presentation/helpers/validator/compare-fields-validation";
import { Validation } from "../../presentation/helpers/validator/validation";

jest.mock("../../presentation/helpers/validator/validation-composite");

describe("Signup validation Factory", () => {
  test("Should call ValidationComposite with all validations", async () => {
    makeSignupValidation();
    const validations: Validation[] = [];
    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequireFieldsValidation(field));
    }
    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
