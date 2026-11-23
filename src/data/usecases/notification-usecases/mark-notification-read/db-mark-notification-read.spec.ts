import { DbMarkNotificationRead } from "./db-mark-notification-read";

const makeSut = () => {
  const repository = {
    markRead: jest.fn().mockResolvedValue({ id: 4 }),
    countUnread: jest.fn().mockResolvedValue(2),
  };
  const publisher = { publishNew: jest.fn(), publishRead: jest.fn(), publishDeleted: jest.fn() };
  return { sut: new DbMarkNotificationRead(repository, repository, publisher), repository, publisher };
};

describe("DbMarkNotificationRead", () => {
  test("Should mark the notification and publish the new unread count", async () => {
    const { sut, repository, publisher } = makeSut();
    const result = await sut.markRead(1, 4);
    expect(repository.markRead).toHaveBeenCalledWith(1, 4);
    expect(publisher.publishRead).toHaveBeenCalledWith(1, { ids: [4], unreadCount: 2 });
    expect(result).toEqual({ id: 4 });
  });

  test("Should return null and not publish when the notification is not found", async () => {
    const { sut, repository, publisher } = makeSut();
    repository.markRead.mockResolvedValueOnce(null);
    expect(await sut.markRead(1, 4)).toBeNull();
    expect(publisher.publishRead).not.toHaveBeenCalled();
  });
});
