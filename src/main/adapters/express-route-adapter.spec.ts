import { Request, Response } from "express";
import { adaptRoute } from "./express-route-adapter";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

const makeController = (httpResponse: HttpResponse): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return httpResponse;
    }
  }
  return new ControllerStub();
};

const makeRequest = (): Request => {
  return {
    body: { any: "body" },
    params: { any: "param" },
    query: { any: "query" },
    headers: { "any-header": "any_value" },
    method: "POST",
    originalUrl: "/any_url",
    accountId: 1,
    accountRole: "admin",
    accountUnitStoreId: 2,
  } as unknown as Request;
};

const makeResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("Express Route Adapter", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should call handle with correct values", async () => {
    const controller = makeController({ statusCode: 200, body: {} });
    const handleSpy = jest.spyOn(controller, "handle");
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(handleSpy).toHaveBeenCalledWith({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: {
        ...req.headers,
        accountId: 1,
        accountRole: "admin",
        accountUnitStoreId: 2,
      },
    });
  });

  test("Should respond with 200 and body on success", async () => {
    const controller = makeController({
      statusCode: 200,
      body: { ok: true },
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("Should respond with error.message when body has message (4xx, no console.error)", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 400,
      body: { message: "invalid_param" },
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "invalid_param" });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test("Should respond with error.message when body is instance of Error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 400,
      body: new Error("error_instance_message"),
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "error_instance_message" });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  test("Should respond with fallback message when body has no message nor is an Error", async () => {
    jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({ statusCode: 400, body: {} });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });

  test("Should call console.error and respond with 500 when statusCode >= 500", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 500,
      body: { message: "internal_error" },
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[route] internal_error",
      expect.objectContaining({
        method: "POST",
        path: "/any_url",
        accountId: 1,
        statusCode: 500,
        message: "internal_error",
      })
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "internal_error" });
  });

  test("Should use default internal error message in console.error when body has no message", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({ statusCode: 500, body: {} });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[route] internal_error",
      expect.objectContaining({
        message: "Internal server error",
      })
    );
  });

  test("Should respond with fallback message when body is an Error with empty message", async () => {
    jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 400,
      body: new Error(""),
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });

  test("Should use default internal error message in console.error when body is undefined", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 500,
      body: undefined,
    });
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[route] internal_error",
      expect.objectContaining({
        message: "Internal server error",
      })
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });

  test("Should use null accountId in console.error when accountId is not present", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const controller = makeController({
      statusCode: 500,
      body: { message: "boom" },
    });
    const req = { ...makeRequest(), accountId: undefined } as unknown as Request;
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[route] internal_error",
      expect.objectContaining({ accountId: null })
    );
  });

  test("Should respond with 500 if controller throws", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    class ControllerStub implements Controller {
      async handle(): Promise<HttpResponse> {
        throw new Error("unexpected_error");
      }
    }
    const controller = new ControllerStub();
    const req = makeRequest();
    const res = makeResponse();
    const sut = adaptRoute(controller);
    await sut(req, res);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Route error:",
      expect.any(Error)
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
