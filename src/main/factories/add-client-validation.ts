import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { CpfDuplicateValidatorAdapter } from "../../utils/cpf-duplicate-validator-adapter";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddClientValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "cpf", "phone"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CpfDuplicateValidation(new CpfDuplicateValidatorAdapter(prisma))
  );
  return new ValidationComposite(validations);
};
