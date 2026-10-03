import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class RequireFieldsValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error {
    const value = input[this.fieldName];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return new MissingParamError(this.fieldName);
    }
  }
}
