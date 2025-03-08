import { ValidationComposite } from "./validation-composite";
import { MissingParamError } from "../../errors";
import { Validation } from "./validation";

describe("validation Composite", () => {
  test("Should return an error if any validation fails", async () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingParamError("field");
      }
    }
    const validation = new ValidationStub();
    const sut = new ValidationComposite([validation]);
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
