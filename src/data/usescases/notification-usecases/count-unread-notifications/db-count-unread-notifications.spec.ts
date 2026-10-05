import { DbCountUnreadNotifications } from "./db-count-unread-notifications";

describe("DbCountUnreadNotifications", () => {
  test("Should return the repository count", async () => {
    const repository = { countUnread: jest.fn().mockResolvedValue(5) };
    const sut = new DbCountUnreadNotifications(repository);
    expect(await sut.countUnread(1)).toBe(5);
    expect(repository.countUnread).toHaveBeenCalledWith(1);
  });
});
