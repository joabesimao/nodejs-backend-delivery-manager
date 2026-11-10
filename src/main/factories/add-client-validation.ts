import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { makeClientRepository } from "./repositories";

export const makeAddClientValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "cpf", "phone"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CpfDuplicateValidation(makeClientRepository())
  );
  return new ValidationComposite(validations);
};
