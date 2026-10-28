import { DbLoadNotifications, MAX_NOTIFICATIONS_PAGE_SIZE } from "./db-load-notifications";

const makeSut = () => {
  const repository = { load: jest.fn().mockResolvedValue({ items: [], nextCursor: null }) };
  return { sut: new DbLoadNotifications(repository), repository };
};

describe("DbLoadNotifications", () => {
  test("Should forward the params to the repository", async () => {
    const { sut, repository } = makeSut();
    const result = await sut.load({ recipientId: 1, cursor: 5, limit: 10, unreadOnly: true });
    expect(repository.load).toHaveBeenCalledWith({ recipientId: 1, cursor: 5, limit: 10, unreadOnly: true });
    expect(result).toEqual({ items: [], nextCursor: null });
  });

  test("Should clamp the limit", async () => {
    const { sut, repository } = makeSut();
    await sut.load({ recipientId: 1, limit: 1000 });
    expect(repository.load).toHaveBeenLastCalledWith({ recipientId: 1, limit: MAX_NOTIFICATIONS_PAGE_SIZE });
    await sut.load({ recipientId: 1, limit: -3 });
    expect(repository.load).toHaveBeenLastCalledWith({ recipientId: 1, limit: 1 });
  });
});
