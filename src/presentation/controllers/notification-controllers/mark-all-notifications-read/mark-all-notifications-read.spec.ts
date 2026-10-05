import { MarkAllNotificationsReadController } from "./mark-all-notifications-read";
import { InvalidParamError } from "../../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const markAllRead = { markAllRead: jest.fn().mockResolvedValue(2) };
  return { sut: new MarkAllNotificationsReadController(markAllRead), markAllRead };
};

describe("MarkAllNotificationsRead Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {} })).toEqual(unauthorized());
  });

  test("Should return 400 for an unknown type", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, body: { type: "nope" } })).toEqual(
      badRequest(new InvalidParamError("type"))
    );
  });

  test("Should return 200 with the number of updated notifications", async () => {
    const { sut, markAllRead } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, body: { type: "chat_message" } })).toEqual(ok({ updated: 2 }));
    expect(markAllRead.markAllRead).toHaveBeenCalledWith(1, "chat_message");
    await sut.handle({ headers: { accountId: 1 } });
    expect(markAllRead.markAllRead).toHaveBeenLastCalledWith(1, undefined);
  });

  test("Should return 500 if MarkAllNotificationsRead throws", async () => {
    const { sut, markAllRead } = makeSut();
    markAllRead.markAllRead.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ headers: { accountId: 1 } })).toEqual(serverError(new Error()));
  });
});
