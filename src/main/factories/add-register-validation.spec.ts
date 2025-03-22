import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { makeAddRegisterValidation } from "./add-register-validation";
import { Validation } from "../../presentation/protocols/validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("Add Order validation Factory", () => {
  test("Should call ValidationComposite with all validations", async () => {
    makeAddRegisterValidation();
    const validations: Validation[] = [];
    for (const field of ["client", "address"]) {
      validations.push(new RequireFieldsValidation(field));
    }
    for (const field of ["name", "lastName", "phone"]) {
      validations.push(new RequireFieldsValidation(field));
    }
    for (const field of [
      "street",
      "neighborhood",
      "numberHouse",
      "reference",
      "city",
    ]) {
      validations.push(new RequireFieldsValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
