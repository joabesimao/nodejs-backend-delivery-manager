import { ValidationComposite, CivilDateValidation, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateOilChangeLogValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new PositiveNumberValidation("km"));
  validations.push(new CivilDateValidation("changeDate"));
  return new ValidationComposite(validations);
};
