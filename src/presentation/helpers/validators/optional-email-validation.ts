import { InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "../../protocols/validation";

export class OptionalEmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  async validate(input: any): Promise<Error> {
    const value = input[this.fieldName];
    if (value === undefined) return;

    if (!(await this.emailValidator.isValid(value))) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
