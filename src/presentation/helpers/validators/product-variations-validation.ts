import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class ProductVariationsValidation implements Validation {
  validate(input: any): Error {
    const variations = input.variations;
    if (variations === undefined || variations === null) return;

    if (!Array.isArray(variations)) {
      return new InvalidParamError("variations");
    }

    const isValid = variations.every(
      (v) =>
        v &&
        typeof v.attribute === "string" &&
        v.attribute.trim() !== "" &&
        typeof v.value === "string" &&
        v.value.trim() !== ""
    );

    if (!isValid) {
      return new InvalidParamError("variations");
    }
  }
}
