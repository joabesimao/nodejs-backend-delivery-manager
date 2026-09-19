import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class AllowedValuesValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly allowedValues: string[],
  ) {}

  validate(input: any): Error {
    if (
      input[this.fieldName] !== undefined &&
      !this.allowedValues.includes(input[this.fieldName])
    ) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
