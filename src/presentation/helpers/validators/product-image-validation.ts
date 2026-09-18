import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const normalizeBase64 = (imageBase64: string): string => {
  const marker = ",";
  const markerIndex = imageBase64.indexOf(marker);

  if (markerIndex >= 0 && imageBase64.startsWith("data:")) {
    return imageBase64.slice(markerIndex + 1);
  }

  return imageBase64;
};

const estimateBase64Bytes = (base64Value: string): number => {
  const padding = base64Value.match(/=+$/)?.[0].length ?? 0;
  return Math.floor((base64Value.length * 3) / 4) - padding;
};

export class ProductImageValidation implements Validation {
  validate(input: any): Error {
    const imageBase64 = input.imageBase64;
    if (!imageBase64) return;

    if (typeof imageBase64 !== "string") {
      return new InvalidParamError("imageBase64");
    }

    const normalized = normalizeBase64(imageBase64);
    if (estimateBase64Bytes(normalized) > MAX_IMAGE_SIZE_BYTES) {
      return new InvalidParamError("imageBase64");
    }
  }
}
