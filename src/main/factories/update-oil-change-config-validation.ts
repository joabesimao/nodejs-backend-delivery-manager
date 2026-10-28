import { ValidationComposite, RequireFieldsValidation, PositiveNumberValidation } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateOilChangeConfigValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(new RequireFieldsValidation("intervalKm"));
  validations.push(new PositiveNumberValidation("intervalKm"));
  return new ValidationComposite(validations);
};
