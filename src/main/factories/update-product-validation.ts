import {
  OptionalFieldTypeValidation,
  ValidationComposite,
  ProductVariationsValidation,
  ProductImageValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateProductValidation = (): ValidationComposite => {
  const validations: Validation[] = [
    new OptionalFieldTypeValidation("name", "string"),
    new OptionalFieldTypeValidation("price", "number"),
    new OptionalFieldTypeValidation("description", "string"),
    new OptionalFieldTypeValidation("category", "string"),
    new OptionalFieldTypeValidation("subcategory", "string"),
    new OptionalFieldTypeValidation("brand", "string"),
    new OptionalFieldTypeValidation("model", "string"),
    new OptionalFieldTypeValidation("unit", "string"),
    new OptionalFieldTypeValidation("barcode", "string"),
    new OptionalFieldTypeValidation("status", "boolean"),
    new OptionalFieldTypeValidation("notes", "string"),
    new ProductVariationsValidation(),
    new ProductImageValidation(),
  ];
  return new ValidationComposite(validations);
};
