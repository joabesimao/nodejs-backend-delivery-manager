import { ConsoleLogErrorRepository } from "./console-log-error-repository";

describe("ConsoleLogErrorRepository", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should write the stack to console.error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const sut = new ConsoleLogErrorRepository();

    await sut.log("any_stack");

    expect(consoleErrorSpy).toHaveBeenCalledWith("any_stack");
  });

  test("Should resolve without throwing", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const sut = new ConsoleLogErrorRepository();

    await expect(sut.log("any_stack")).resolves.toBeUndefined();
  });
});
