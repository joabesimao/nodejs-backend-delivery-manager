import { DbMarkAllNotificationsRead } from "./db-mark-all-notifications-read";

const makeSut = () => {
  const repository = {
    markAllRead: jest.fn().mockResolvedValue(3),
    countUnread: jest.fn().mockResolvedValue(0),
  };
  const publisher = { publishNew: jest.fn(), publishRead: jest.fn(), publishDeleted: jest.fn() };
  return { sut: new DbMarkAllNotificationsRead(repository, repository, publisher), repository, publisher };
};

describe("DbMarkAllNotificationsRead", () => {
  test("Should mark all (optionally by type) and publish", async () => {
    const { sut, repository, publisher } = makeSut();
    expect(await sut.markAllRead(1, "chat_message")).toBe(3);
    expect(repository.markAllRead).toHaveBeenCalledWith(1, "chat_message");
    expect(publisher.publishRead).toHaveBeenCalledWith(1, { all: true, type: "chat_message", unreadCount: 0 });
  });

  test("Should not publish when nothing changed", async () => {
    const { sut, repository, publisher } = makeSut();
    repository.markAllRead.mockResolvedValueOnce(0);
    await sut.markAllRead(1);
    expect(publisher.publishRead).not.toHaveBeenCalled();
  });
});
