import { LoadNotificationsController } from "./load-notifications";
import { ok, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const loadNotifications = { load: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) };
  return { sut: new LoadNotificationsController(loadNotifications), loadNotifications };
};

describe("LoadNotifications Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {} })).toEqual(unauthorized());
  });

  test("Should parse the query and return 200", async () => {
    const { sut, loadNotifications } = makeSut();
    const response = await sut.handle({
      headers: { accountId: 1 },
      query: { cursor: "8", limit: "5", unreadOnly: "true" },
    });
    expect(loadNotifications.load).toHaveBeenCalledWith({ recipientId: 1, cursor: 8, limit: 5, unreadOnly: true });
    expect(response).toEqual(ok({ items: [], nextCursor: null }));
  });

  test("Should use defaults when the query is empty", async () => {
    const { sut, loadNotifications } = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: {} });
    expect(loadNotifications.load).toHaveBeenCalledWith({
      recipientId: 1,
      cursor: undefined,
      limit: 20,
      unreadOnly: false,
    });
  });

  test("Should return 500 if LoadNotifications throws", async () => {
    const { sut, loadNotifications } = makeSut();
    loadNotifications.load.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ headers: { accountId: 1 } })).toEqual(serverError(new Error()));
  });
});
