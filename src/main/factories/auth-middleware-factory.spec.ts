import { makeAuthMiddleware } from "./auth-middleware-factory";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";

describe("AuthMiddleware Factory", () => {
  test("Should return an AuthMiddleware instance without a role", () => {
    const authMiddleware = makeAuthMiddleware();
    expect(authMiddleware).toBeInstanceOf(AuthMiddleware);
    expect((authMiddleware as any).role).toBeUndefined();
  });

  test("Should return an AuthMiddleware instance with the given role", () => {
    const authMiddleware = makeAuthMiddleware("some_role");
    expect(authMiddleware).toBeInstanceOf(AuthMiddleware);
    expect((authMiddleware as any).role).toBe("some_role");
  });
});
