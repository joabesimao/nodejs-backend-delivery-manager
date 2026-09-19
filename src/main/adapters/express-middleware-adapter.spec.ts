import { NextFunction, Request, Response } from "express";
import { adaptMiddleware } from "./express-middleware-adapter";
import { Middleware } from "../../presentation/protocols/middleware";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

const makeMiddleware = (httpResponse: HttpResponse): Middleware => {
  class MiddlewareStub implements Middleware {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return httpResponse;
    }
  }
  return new MiddlewareStub();
};

const makeRequest = (): Request => {
  return {
    headers: {
      "x-access-token": "any_token",
    },
  } as unknown as Request;
};

const makeResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("Express Middleware Adapter", () => {
  test("Should call handle with correct request", async () => {
    const middleware = makeMiddleware({
      statusCode: 200,
      body: { accountId: "any_id" },
    });
    const handleSpy = jest.spyOn(middleware, "handle");
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(handleSpy).toHaveBeenCalledWith({ headers: req.headers });
  });

  test("Should assign body to req and call next on success", async () => {
    const middleware = makeMiddleware({
      statusCode: 200,
      body: { accountId: "any_id" },
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect((req as any).accountId).toBe("any_id");
    expect(next).toHaveBeenCalled();
  });

  test("Should respond with error.message when body has message", async () => {
    const middleware = makeMiddleware({
      statusCode: 403,
      body: { message: "access_denied" },
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "access_denied" });
    expect(next).not.toHaveBeenCalled();
  });

  test("Should respond with error.message when body is instance of Error", async () => {
    const middleware = makeMiddleware({
      statusCode: 403,
      body: new Error("error_instance_message"),
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "error_instance_message" });
  });

  test("Should respond with fallback message when body has no message nor is an Error", async () => {
    const middleware = makeMiddleware({
      statusCode: 403,
      body: {},
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });

  test("Should respond with fallback message when body is an Error with empty message", async () => {
    const middleware = makeMiddleware({
      statusCode: 403,
      body: new Error(""),
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });

  test("Should respond with fallback message when body is null/undefined", async () => {
    const middleware = makeMiddleware({
      statusCode: 403,
      body: undefined,
    });
    const req = makeRequest();
    const res = makeResponse();
    const next = jest.fn() as NextFunction;
    const sut = adaptMiddleware(middleware);
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro desconhecido" });
  });
});
