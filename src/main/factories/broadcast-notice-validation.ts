import { ValidationComposite, RequireFieldsValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeBroadcastNoticeValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["title", "body"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  return new ValidationComposite(validations);
};
