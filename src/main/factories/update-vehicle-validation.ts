import { ValidationComposite } from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

// Placa duplicada no update é tratada pelo índice único (P2002 → 409) no controller,
// pois a pré-validação não sabe ignorar o próprio veículo.
export const makeUpdateVehicleValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  return new ValidationComposite(validations);
};
