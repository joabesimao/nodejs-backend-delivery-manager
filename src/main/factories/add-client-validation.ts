import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { ClientMysqlRepository } from "../../infra/db/mysql/client-repository/client-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddClientValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "cpf", "phone"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CpfDuplicateValidation(new ClientMysqlRepository(prisma))
  );
  return new ValidationComposite(validations);
};
