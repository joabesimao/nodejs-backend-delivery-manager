import { MarkNotificationReadController } from "./mark-notification-read";
import { InvalidParamError } from "../../../errors";
import { badRequest, noExists, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const markRead = { markRead: jest.fn().mockResolvedValue({ id: 3 }) };
  return { sut: new MarkNotificationReadController(markRead), markRead };
};

describe("MarkNotificationRead Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {}, params: { id: "3" } })).toEqual(unauthorized());
  });

  test("Should return 400 for an invalid id", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "abc" } })).toEqual(
      badRequest(new InvalidParamError("id"))
    );
  });

  test("Should return 400 (no exists) when the notification is not the account's", async () => {
    const { sut, markRead } = makeSut();
    markRead.markRead.mockResolvedValueOnce(null);
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(noExists());
  });

  test("Should return 200 with the notification", async () => {
    const { sut, markRead } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(ok({ id: 3 }));
    expect(markRead.markRead).toHaveBeenCalledWith(1, 3);
  });

  test("Should return 500 if MarkNotificationRead throws", async () => {
    const { sut, markRead } = makeSut();
    markRead.markRead.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(serverError(new Error()));
  });
});
