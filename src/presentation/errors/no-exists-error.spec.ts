import { NoExistsError } from "./no-exists-error";

describe("NoExistsError", () => {
  test("Should have correct message and name", () => {
    const sut = new NoExistsError();
    expect(sut.message).toBe("No Exists resources");
    expect(sut.name).toBe("NoExistsErrorResources");
    expect(sut).toBeInstanceOf(Error);
  });
});
