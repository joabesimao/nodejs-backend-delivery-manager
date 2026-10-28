import { DbNotifyAccounts } from "./db-notify-accounts";
import { Notification } from "../../../../domain/models/notification/notification-model";
import { NotifyAccountsModel } from "../../../../domain/usescases/notification/notify-accounts";

const makeFakeNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 1,
  recipientId: 1,
  type: "admin_notice",
  title: "any_title",
  body: "any_body",
  link: null,
  data: null,
  dedupeKey: null,
  readAt: null,
  createdAt: new Date("2026-10-03T00:00:00.000Z"),
  updatedAt: new Date("2026-10-03T00:00:00.000Z"),
  ...overrides,
});

const makeModel = (overrides: Partial<NotifyAccountsModel> = {}): NotifyAccountsModel => ({
  recipientIds: [1, 2],
  type: "admin_notice",
  title: "any_title",
  body: "any_body",
  ...overrides,
});

const makeSut = () => {
  const repository = {
    add: jest.fn().mockImplementation(async (data) => makeFakeNotification({ recipientId: data.recipientId })),
    findByDedupeKey: jest.fn().mockResolvedValue(null),
    updateContent: jest.fn().mockImplementation(async (id, data) => makeFakeNotification({ id, ...data })),
    countUnread: jest.fn().mockResolvedValue(3),
  };
  const publisher = { publishNew: jest.fn(), publishRead: jest.fn(), publishDeleted: jest.fn() };
  const sut = new DbNotifyAccounts(repository, repository, repository, repository, publisher);
  return { sut, repository, publisher };
};

describe("DbNotifyAccounts", () => {
  test("Should create one notification per distinct valid recipient and publish it", async () => {
    const { sut, repository, publisher } = makeSut();
    const notified = await sut.notify(makeModel({ recipientIds: [1, 2, 2, 0, -1] }));
    expect(notified).toBe(2);
    expect(repository.add).toHaveBeenCalledTimes(2);
    expect(repository.add).toHaveBeenCalledWith(expect.objectContaining({ recipientId: 1, title: "any_title" }));
    expect(publisher.publishNew).toHaveBeenCalledWith(2, expect.objectContaining({ recipientId: 2 }), 3);
  });

  test("Should update the unread notification with the same dedupeKey when aggregating", async () => {
    const { sut, repository, publisher } = makeSut();
    repository.findByDedupeKey.mockResolvedValueOnce(makeFakeNotification({ id: 9, data: { count: 2 } }));
    await sut.notify(
      makeModel({
        recipientIds: [1],
        dedupeKey: "chat:unit:1",
        dedupe: "aggregate",
        aggregateTitle: (count) => `${count} mensagens`,
        data: { unitStoreId: 1 },
      })
    );
    expect(repository.findByDedupeKey).toHaveBeenCalledWith(1, "chat:unit:1", { unreadOnly: true, includeDeleted: false });
    expect(repository.add).not.toHaveBeenCalled();
    expect(repository.updateContent).toHaveBeenCalledWith(9, {
      title: "3 mensagens",
      body: "any_body",
      data: { unitStoreId: 1, count: 3 },
    });
    expect(publisher.publishNew).toHaveBeenCalledWith(1, expect.objectContaining({ id: 9 }), 3);
  });

  test("Should create with count 1 when aggregating and nothing unread exists", async () => {
    const { sut, repository } = makeSut();
    await sut.notify(makeModel({ recipientIds: [1], dedupeKey: "k", dedupe: "aggregate" }));
    expect(repository.add).toHaveBeenCalledWith(expect.objectContaining({ dedupeKey: "k", data: { count: 1 } }));
  });

  test("Should skip recipients that already have the dedupeKey when dedupe is skip", async () => {
    const { sut, repository, publisher } = makeSut();
    repository.findByDedupeKey.mockResolvedValueOnce(makeFakeNotification()).mockResolvedValueOnce(null);
    const notified = await sut.notify(makeModel({ dedupeKey: "oil:1", dedupe: "skip" }));
    expect(repository.findByDedupeKey).toHaveBeenCalledWith(1, "oil:1", { unreadOnly: false, includeDeleted: true });
    expect(notified).toBe(1);
    expect(repository.add).toHaveBeenCalledTimes(1);
    expect(publisher.publishNew).toHaveBeenCalledTimes(1);
  });

  test("Should aggregate concurrent events for the same recipient into one notification", async () => {
    const { sut, repository } = makeSut();
    const saved: Notification[] = [];
    repository.findByDedupeKey.mockImplementation(async () => saved[saved.length - 1] ?? null);
    repository.add.mockImplementation(async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      const notification = makeFakeNotification({ id: 1, recipientId: data.recipientId, data: data.data });
      saved.push(notification);
      return notification;
    });
    repository.updateContent.mockImplementation(async (id, data) => {
      const notification = makeFakeNotification({ id, ...data });
      saved.push(notification);
      return notification;
    });
    const model = makeModel({ recipientIds: [1], dedupeKey: "chat:unit:1", dedupe: "aggregate" });

    await Promise.all([sut.notify(model), sut.notify(model), sut.notify(model)]);

    expect(repository.add).toHaveBeenCalledTimes(1);
    expect(repository.updateContent).toHaveBeenCalledTimes(2);
    expect(saved[saved.length - 1].data).toEqual({ count: 3 });
  });

  test("Should keep notifying the other recipients when one fails", async () => {
    const { sut, repository } = makeSut();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    repository.add.mockRejectedValueOnce(new Error());
    const notified = await sut.notify(makeModel());
    expect(notified).toBe(1);
  });

  test("Should not throw when publishing fails", async () => {
    const { sut, publisher } = makeSut();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    publisher.publishNew.mockImplementation(() => {
      throw new Error();
    });
    await expect(sut.notify(makeModel())).resolves.toBe(2);
  });
});
