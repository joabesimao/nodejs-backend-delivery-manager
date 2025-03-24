import {
  ValidationComposite,
  RequireFieldsValidation,
} from "../../presentation/helpers/validators";
import { makeAddOrderDeliveryValidation } from "./add-order-delivery-validation";
import { Validation } from "../../presentation/protocols/validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("Add Order validation Factory", () => {
  test("Should call ValidationComposite with all validations", async () => {
    makeAddOrderDeliveryValidation();
    const validations: Validation[] = [];
    for (const field of ["register", "amount", "data", "quantity"]) {
      validations.push(new RequireFieldsValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
