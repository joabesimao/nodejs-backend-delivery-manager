import { ValidationComposite, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateOilChangeLogValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new PositiveNumberValidation("km"));
  return new ValidationComposite(validations);
};
