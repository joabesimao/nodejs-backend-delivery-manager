import { onlyDigits } from "./only-digits";

describe("onlyDigits", () => {
  test("Should strip punctuation from a formatted CPF", () => {
    expect(onlyDigits("123.456.789-01")).toBe("12345678901");
  });

  test("Should keep a digits-only value unchanged", () => {
    expect(onlyDigits("12345678901")).toBe("12345678901");
  });

  test("Should return an empty string when there are no digits", () => {
    expect(onlyDigits("abc")).toBe("");
  });
});
