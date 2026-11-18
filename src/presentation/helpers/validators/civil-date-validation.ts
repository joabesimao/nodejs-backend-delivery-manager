import { parseCivilDate } from "../../../data/helpers/date-time";
import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class CivilDateValidation implements Validation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error {
    const value = input[this.fieldName];
    if (value === undefined || value === null) {
      return null;
    }
    if (!parseCivilDate(value)) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
