import { BroadcastNoticeController } from "./broadcast-notice";
import { InvalidParamError, MissingParamError } from "../../../errors";
import { AccessDeniedError } from "../../../errors/access-denied-error";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols/http";

const makeRequest = (body: Record<string, unknown> = {}): HttpRequest => ({
  headers: { accountId: 1 },
  body: { title: " Aviso ", body: " Reunião às 18h ", ...body },
});

const makeSut = () => {
  const broadcastNotice = { broadcast: jest.fn().mockResolvedValue(3) };
  const validation = { validate: jest.fn().mockReturnValue(undefined) };
  return { sut: new BroadcastNoticeController(broadcastNotice, validation), broadcastNotice, validation };
};

describe("BroadcastNotice Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {}, body: {} })).toEqual(unauthorized());
  });

  test("Should return 400 if validation fails", async () => {
    const { sut, validation } = makeSut();
    validation.validate.mockReturnValueOnce(new MissingParamError("title"));
    expect(await sut.handle(makeRequest())).toEqual(badRequest(new MissingParamError("title")));
  });

  test("Should return 400 for invalid roles or unit", async () => {
    const { sut } = makeSut();
    expect(await sut.handle(makeRequest({ roles: ["root"] }))).toEqual(badRequest(new InvalidParamError("roles")));
    expect(await sut.handle(makeRequest({ roles: "admin" }))).toEqual(badRequest(new InvalidParamError("roles")));
    expect(await sut.handle(makeRequest({ unitStoreId: "x" }))).toEqual(
      badRequest(new InvalidParamError("unitStoreId"))
    );
  });

  test("Should return 400 for a title that is too long", async () => {
    const { sut } = makeSut();
    expect(await sut.handle(makeRequest({ title: "a".repeat(192) }))).toEqual(
      badRequest(new InvalidParamError("title"))
    );
  });

  test("Should broadcast trimmed values and return the recipients count", async () => {
    const { sut, broadcastNotice } = makeSut();
    const response = await sut.handle(makeRequest({ roles: ["user"], unitStoreId: "2" }));
    expect(broadcastNotice.broadcast).toHaveBeenCalledWith({
      senderId: 1,
      title: "Aviso",
      body: "Reunião às 18h",
      roles: ["user"],
      unitStoreId: 2,
    });
    expect(response).toEqual(ok({ recipients: 3 }));
  });

  test("Should return 403 when the unit is outside the sender scope", async () => {
    const { sut, broadcastNotice } = makeSut();
    broadcastNotice.broadcast.mockRejectedValueOnce(new AccessDeniedError());
    expect(await sut.handle(makeRequest())).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 500 if BroadcastNotice throws", async () => {
    const { sut, broadcastNotice } = makeSut();
    broadcastNotice.broadcast.mockRejectedValueOnce(new Error());
    expect(await sut.handle(makeRequest())).toEqual(serverError(new Error()));
  });
});
