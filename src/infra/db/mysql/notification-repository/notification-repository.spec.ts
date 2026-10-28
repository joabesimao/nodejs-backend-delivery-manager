import { NotificationMysqlRepository } from "./notification-repository";
import { getAccountScope, listDescendantUnitIds, resolveRootStoreId } from "../../../../main/realtime/store-scope";

jest.mock("../../../../main/realtime/store-scope", () => ({
  getAccountScope: jest.fn(),
  listDescendantUnitIds: jest.fn(),
  resolveRootStoreId: jest.fn(),
}));

const makeRow = (id = 1) => ({
  id,
  recipientId: 1,
  type: "admin_notice",
  title: "t",
  body: "b",
  link: null,
  data: null,
  dedupeKey: null,
  readAt: null,
  deletedAt: null,
  createdAt: new Date("2026-10-03T00:00:00.000Z"),
  updatedAt: new Date("2026-10-03T00:00:00.000Z"),
});

const makeFakePrisma = () => ({
  notification: {
    create: jest.fn().mockResolvedValue(makeRow()),
    findFirst: jest.fn().mockResolvedValue(makeRow()),
    findMany: jest.fn().mockResolvedValue([makeRow(3), makeRow(2), makeRow(1)]),
    update: jest.fn().mockResolvedValue({ ...makeRow(), readAt: new Date() }),
    updateMany: jest.fn().mockResolvedValue({ count: 2 }),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    count: jest.fn().mockResolvedValue(4),
  },
  account: {
    findMany: jest.fn().mockResolvedValue([{ id: 5 }, { id: 6 }]),
  },
});

const makeSut = () => {
  const prisma = makeFakePrisma();
  return { sut: new NotificationMysqlRepository(prisma as any), prisma };
};

describe("Notification MySql Repository", () => {
  test("add() should create the notification", async () => {
    const { sut, prisma } = makeSut();
    await sut.add({ recipientId: 1, type: "admin_notice", title: "t", body: "b", data: { a: 1 } });
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        recipientId: 1,
        type: "admin_notice",
        title: "t",
        body: "b",
        link: undefined,
        data: { a: 1 },
        dedupeKey: undefined,
      },
    });
  });

  test("findByDedupeKey() should filter unread only when asked", async () => {
    const { sut, prisma } = makeSut();
    await sut.findByDedupeKey(1, "k", { unreadOnly: true });
    expect(prisma.notification.findFirst).toHaveBeenCalledWith({
      where: { recipientId: 1, dedupeKey: "k", readAt: null, deletedAt: null },
      orderBy: { id: "desc" },
    });
    await sut.findByDedupeKey(1, "k");
    expect(prisma.notification.findFirst).toHaveBeenLastCalledWith({
      where: { recipientId: 1, dedupeKey: "k", deletedAt: null },
      orderBy: { id: "desc" },
    });
  });

  test("findByDedupeKey() should also see deleted notifications when asked", async () => {
    const { sut, prisma } = makeSut();
    await sut.findByDedupeKey(1, "k", { includeDeleted: true });
    expect(prisma.notification.findFirst).toHaveBeenCalledWith({
      where: { recipientId: 1, dedupeKey: "k" },
      orderBy: { id: "desc" },
    });
  });

  test("should not expose deletedAt", async () => {
    const { sut } = makeSut();
    const notification = await sut.add({ recipientId: 1, type: "admin_notice", title: "t", body: "b" });
    expect(notification).not.toHaveProperty("deletedAt");
  });

  test("load() should paginate with a cursor and report the next cursor", async () => {
    const { sut, prisma } = makeSut();
    const result = await sut.load({ recipientId: 1, limit: 2, cursor: 9, unreadOnly: true });
    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { recipientId: 1, deletedAt: null, readAt: null },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: 3,
      cursor: { id: 9 },
      skip: 1,
    });
    expect(result.items.map((item) => item.id)).toEqual([3, 2]);
    expect(result.nextCursor).toBe(2);
  });

  test("load() should return a null cursor on the last page", async () => {
    const { sut } = makeSut();
    const result = await sut.load({ recipientId: 1, limit: 5 });
    expect(result.nextCursor).toBeNull();
  });

  test("markRead() should only touch the recipient's unread notification", async () => {
    const { sut, prisma } = makeSut();
    await sut.markRead(1, 1);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith({ where: { id: 1, recipientId: 1, deletedAt: null } });
    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { readAt: expect.any(Date) },
    });

    prisma.notification.findFirst.mockResolvedValueOnce(null);
    expect(await sut.markRead(2, 1)).toBeNull();

    prisma.notification.update.mockClear();
    prisma.notification.findFirst.mockResolvedValueOnce({ ...makeRow(), readAt: new Date() });
    await sut.markRead(1, 1);
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });

  test("markAllRead() should be scoped to the recipient", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.markAllRead(1, "chat_message")).toBe(2);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { recipientId: 1, readAt: null, deletedAt: null, type: "chat_message" },
      data: { readAt: expect.any(Date) },
    });
  });

  test("delete() should soft delete only the recipient's notification", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.delete(1, 7)).toBe(true);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 7, recipientId: 1, deletedAt: null },
      data: { deletedAt: expect.any(Date) },
    });
    expect(prisma.notification.deleteMany).not.toHaveBeenCalled();

    prisma.notification.updateMany.mockResolvedValueOnce({ count: 0 });
    expect(await sut.delete(1, 7)).toBe(false);
  });

  test("countUnread() should count unread notifications", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.countUnread(1)).toBe(4);
    expect(prisma.notification.count).toHaveBeenCalledWith({ where: { recipientId: 1, readAt: null, deletedAt: null } });
  });

  test("loadRecipientIds() should load active accounts matching the filter", async () => {
    const { sut, prisma } = makeSut();
    const ids = await sut.loadRecipientIds({ roles: ["admin"], unitStoreIds: [1], excludeAccountIds: [2] });
    expect(prisma.account.findMany).toHaveBeenCalledWith({
      where: { active: true, role: { in: ["admin"] }, unitStoreId: { in: [1] }, id: { notIn: [2] } },
      select: { id: true },
    });
    expect(ids).toEqual([5, 6]);
  });

  test("loadRecipientIds() should return nobody for an empty unit list", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.loadRecipientIds({ unitStoreIds: [] })).toEqual([]);
    expect(prisma.account.findMany).not.toHaveBeenCalled();
  });

  test("loadNetworkUnitIds() should list the whole network of the unit", async () => {
    const { sut } = makeSut();
    (resolveRootStoreId as jest.Mock).mockResolvedValueOnce(1);
    (listDescendantUnitIds as jest.Mock).mockResolvedValueOnce([1, 2, 3]);
    expect(await sut.loadNetworkUnitIds(2)).toEqual([1, 2, 3]);
    expect(listDescendantUnitIds).toHaveBeenCalledWith(expect.anything(), 1);
  });

  test("loadVisibleUnitIds() should map the account scope", async () => {
    const { sut } = makeSut();
    const scopeMock = getAccountScope as jest.Mock;
    scopeMock.mockResolvedValueOnce({ role: "principal", unitStoreId: 1, visibleUnitIds: [1, 2] });
    expect(await sut.loadVisibleUnitIds(1)).toEqual([1, 2]);
    scopeMock.mockResolvedValueOnce({ role: "principal", unitStoreId: null, visibleUnitIds: [] });
    expect(await sut.loadVisibleUnitIds(1)).toBeNull();
    scopeMock.mockResolvedValueOnce({ role: "branch", unitStoreId: null, visibleUnitIds: [] });
    expect(await sut.loadVisibleUnitIds(1)).toEqual([]);
    scopeMock.mockResolvedValueOnce(null);
    expect(await sut.loadVisibleUnitIds(1)).toEqual([]);
  });
});
