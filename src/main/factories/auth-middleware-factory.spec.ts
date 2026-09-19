import { makeAuthMiddleware } from "./auth-middleware-factory";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";

describe("AuthMiddleware Factory", () => {
  test("Should return an AuthMiddleware instance without roles", () => {
    const authMiddleware = makeAuthMiddleware();
    expect(authMiddleware).toBeInstanceOf(AuthMiddleware);
    expect((authMiddleware as any).roles).toBeUndefined();
  });

  test("Should return an AuthMiddleware instance with the given roles", () => {
    const authMiddleware = makeAuthMiddleware(["admin", "gerente_estoque"]);
    expect(authMiddleware).toBeInstanceOf(AuthMiddleware);
    expect((authMiddleware as any).roles).toEqual([
      "admin",
      "gerente_estoque",
    ]);
  });
});
