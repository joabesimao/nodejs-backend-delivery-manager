import { InvalidParamError } from "../../errors";
import { ProductVariationsValidation } from "./product-variations-validation";

const makeSut = (): ProductVariationsValidation => new ProductVariationsValidation();

describe("ProductVariationsValidation", () => {
  test("Should not return if variations is absent", () => {
    const sut = makeSut();
    const error = sut.validate({});
    expect(error).toBeFalsy();
  });

  test("Should return InvalidParamError if variations is not an array", () => {
    const sut = makeSut();
    const error = sut.validate({ variations: "invalid" });
    expect(error).toEqual(new InvalidParamError("variations"));
  });

  test("Should return InvalidParamError if an item is missing attribute or value", () => {
    const sut = makeSut();
    const error = sut.validate({ variations: [{ attribute: "Tamanho" }] });
    expect(error).toEqual(new InvalidParamError("variations"));
  });

  test("Should return InvalidParamError if an item has an empty attribute or value", () => {
    const sut = makeSut();
    const error = sut.validate({ variations: [{ attribute: "  ", value: "M" }] });
    expect(error).toEqual(new InvalidParamError("variations"));
  });

  test("Should not return if variations is a valid array", () => {
    const sut = makeSut();
    const error = sut.validate({
      variations: [
        { attribute: "Tamanho", value: "M" },
        { attribute: "Cor", value: "Azul" },
      ],
    });
    expect(error).toBeFalsy();
  });
});
