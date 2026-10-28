import { CountUnreadNotificationsController } from "./count-unread-notifications";
import { ok, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const countUnread = { countUnread: jest.fn().mockResolvedValue(4) };
  return { sut: new CountUnreadNotificationsController(countUnread), countUnread };
};

describe("CountUnreadNotifications Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {} })).toEqual(unauthorized());
  });

  test("Should return 200 with the unread count", async () => {
    const { sut, countUnread } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 } })).toEqual(ok({ unreadCount: 4 }));
    expect(countUnread.countUnread).toHaveBeenCalledWith(1);
  });

  test("Should return 500 if CountUnreadNotifications throws", async () => {
    const { sut, countUnread } = makeSut();
    countUnread.countUnread.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ headers: { accountId: 1 } })).toEqual(serverError(new Error()));
  });
});
