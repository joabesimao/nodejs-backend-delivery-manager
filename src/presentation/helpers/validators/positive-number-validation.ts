import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class PositiveNumberValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error {
    const value = input[this.fieldName];
    if (value === undefined || value === null) {
      return null;
    }
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
