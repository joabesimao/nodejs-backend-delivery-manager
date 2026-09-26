import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  sign(): string {
    return "any_token";
  },

  verify(): { id: string } {
    return { id: "any_id" };
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
};

describe("Jwt Adapter", () => {
  describe("sign()", () => {
    test("Should call sign with correct values", async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "sign");
      await sut.encrypt("any_value");
      expect(signSpy).toHaveBeenCalledWith(
        { id: "any_value", type: "access" },
        "secret",
        undefined
      );
    });

    test("Should return a token on sign success", async () => {
      const sut = makeSut();
      const token = await sut.encrypt("any_value");
      expect(token).toBe("any_token");
    });

    test("Should throws if sign throws ", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt("any_value");
      await expect(promise).rejects.toThrow();
    });
  });
  describe("verify()", () => {
    test("Should call verify with correct values", async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("any_token");
      expect(signSpy).toHaveBeenCalledWith("any_token", "secret");
    });

    test("Should return the payload id on verify success", async () => {
      const sut = makeSut();
      const token = await sut.decrypt("any_value");
      expect(token).toBe("any_id");
    });

    test("Should return null if verify throws", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
        throw new Error();
      });
      const token = await sut.decrypt("any_value");
      expect(token).toBeNull();
    });

    test("Should return null if verify returns a payload without id", async () => {
      const sut = makeSut();
      jest
        .spyOn(jwt, "verify")
        .mockImplementationOnce(() => ({}));
      const token = await sut.decrypt("any_value");
      expect(token).toBeNull();
    });
  });

  describe("decode()", () => {
    test("Should call verify with correct values", async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decode("any_token");
      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });

    test("Should return the payload on decode success", async () => {
      const sut = makeSut();
      const payload = await sut.decode("any_token");
      expect(payload).toEqual({ id: "any_id" });
    });

    test("Should return null if verify throws", async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
        throw new Error();
      });
      const payload = await sut.decode("any_token");
      expect(payload).toBeNull();
    });
  });
});
