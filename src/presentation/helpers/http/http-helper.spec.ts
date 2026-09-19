import {
  badRequest,
  serverError,
  unauthorized,
  ok,
  noContent,
  forbidden,
  noExists,
} from "./http-helper";
import { ServerError } from "../../errors";
import { NoExistsError } from "../../errors/no-exists-error";
import { UnauthorizedError } from "../../errors/unauthorized-error";

describe("Http Helper", () => {
  test("Should return 400 with the given error as body on badRequest", () => {
    const error = new Error("any_error");
    const httpResponse = badRequest(error);
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: error,
    });
  });

  test("Should return 500 with a ServerError on serverError", () => {
    const error = new Error("any_error");
    error.stack = "any_stack";
    const httpResponse = serverError(error);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(error.stack));
  });

  test("Should return 401 with an UnauthorizedError on unauthorized", () => {
    const httpResponse = unauthorized();
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: new UnauthorizedError(),
    });
  });

  test("Should return 200 with the given data on ok", () => {
    const data = { any: "data" };
    const httpResponse = ok(data);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: data,
    });
  });

  test("Should return 204 with null body on noContent", () => {
    const httpResponse = noContent();
    expect(httpResponse).toEqual({
      statusCode: 204,
      body: null,
    });
  });

  test("Should return 403 with the given error as body on forbidden", () => {
    const error = new Error("any_error");
    const httpResponse = forbidden(error);
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: error,
    });
  });

  test("Should return 400 with a NoExistsError on noExists", () => {
    const httpResponse = noExists();
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: new NoExistsError(),
    });
  });
});
