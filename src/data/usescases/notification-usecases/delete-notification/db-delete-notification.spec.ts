import { DbDeleteNotification } from "./db-delete-notification";

const makeSut = () => {
  const repository = {
    delete: jest.fn().mockResolvedValue(true),
    countUnread: jest.fn().mockResolvedValue(1),
  };
  const publisher = { publishNew: jest.fn(), publishRead: jest.fn(), publishDeleted: jest.fn() };
  return { sut: new DbDeleteNotification(repository, repository, publisher), repository, publisher };
};

describe("DbDeleteNotification", () => {
  test("Should delete and publish the new unread count", async () => {
    const { sut, repository, publisher } = makeSut();
    expect(await sut.delete(1, 4)).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith(1, 4);
    expect(publisher.publishDeleted).toHaveBeenCalledWith(1, { id: 4, unreadCount: 1 });
  });

  test("Should return false and not publish when nothing was deleted", async () => {
    const { sut, repository, publisher } = makeSut();
    repository.delete.mockResolvedValueOnce(false);
    expect(await sut.delete(1, 4)).toBe(false);
    expect(publisher.publishDeleted).not.toHaveBeenCalled();
  });
});
