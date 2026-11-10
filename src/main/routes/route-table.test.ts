import express, { Express } from "express";
import setupRoutes from "../config/routes";
import { loginRateLimit, refreshRateLimit } from "../middlewares";

jest.mock("../../infra/db/prisma/client", () => ({
  prisma: jest.requireActual("../../test/route-harness").createPrismaMock(),
}));

jest.mock("../factories/auth-middleware-factory", () => ({
  makeAuthMiddleware: (roles?: string[]) => ({ handle: jest.fn(), roles }),
}));

jest.mock("../adapters/express-middleware-adapter", () => ({
  adaptMiddleware: (middleware: { roles?: string[] }) =>
    Object.assign(jest.fn(), {
      describe: `auth(${middleware.roles ? middleware.roles.join(",") : "*"})`,
    }),
}));

jest.mock("../adapters/express-route-adapter", () => ({
  adaptRoute: (controller: object) =>
    Object.assign(jest.fn(), { describe: controller.constructor.name }),
}));

interface Handler {
  describe?: string;
}

interface Layer {
  handle: Handler & { stack?: Layer[] };
  route?: {
    path: string;
    methods: Record<string, boolean>;
    stack: Array<{ handle: Handler }>;
  };
}

const describeHandler = (handle: Handler): string => {
  if (handle === (loginRateLimit as unknown)) return "loginRateLimit";
  if (handle === (refreshRateLimit as unknown)) return "refreshRateLimit";
  return handle.describe ?? "unknown";
};

const listRoutes = (app: Express): string[] => {
  const appStack = (app as unknown as { _router: { stack: Layer[] } })._router.stack;
  const apiRouter = appStack.find((layer) => layer.handle.stack)?.handle.stack ?? [];
  return apiRouter.flatMap(({ route }) => {
    if (!route) return [];
    const methods = Object.keys(route.methods).map((m) => m.toUpperCase()).join(",");
    const handlers = route.stack.map((s) => describeHandler(s.handle)).join(" > ");
    return [`${methods} /api${route.path} :: ${handlers}`];
  });
};

describe("route table", () => {
  const app = express();
  setupRoutes(app);
  const routes = listRoutes(app);

  test("keeps every route with the same method, path, middlewares and controller", () => {
    expect([...routes].sort()).toMatchSnapshot();
  });

  test("keeps the registration order inside each path prefix", () => {
    const byPrefix: Record<string, string[]> = {};
    for (const route of routes) {
      const [method, path] = route.split(" :: ")[0].split(" ");
      const prefix = path.split("/")[2];
      (byPrefix[prefix] ??= []).push(`${method} ${path}`);
    }
    expect(byPrefix).toMatchSnapshot();
  });

  test("has no duplicated method + path", () => {
    const keys = routes.map((r) => r.split(" :: ")[0]);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test("keeps the notFound handler after every route", () => {
    const appStack = (app as unknown as { _router: { stack: Layer[] } })._router.stack;
    const apiStack = appStack.find((layer) => layer.handle.stack)?.handle.stack ?? [];
    const last = apiStack[apiStack.length - 1];
    expect(last.route).toBeUndefined();
    expect(apiStack.slice(0, -1).every((layer) => layer.route)).toBe(true);
  });
});
