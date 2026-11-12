import MockDate from "mockdate";
import { makeFakeChatMessage } from "../../../../test/chat-fixtures";
import { ChatMessageMysqlRepository } from "./chat-message-repository";

const include = {
  sender: { select: { id: true, name: true, email: true, role: true, unitStoreId: true } },
  unitStore: { select: { id: true, name: true } },
};

const makeFakePrisma = () => ({
  chatMessage: {
    create: jest.fn().mockResolvedValue(makeFakeChatMessage()),
    findMany: jest.fn().mockResolvedValue([makeFakeChatMessage()]),
    findUnique: jest.fn().mockResolvedValue(makeFakeChatMessage()),
    findFirst: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(makeFakeChatMessage()),
    delete: jest.fn().mockResolvedValue({}),
    count: jest.fn().mockResolvedValue(1),
  },
});

const makeSut = () => {
  const prisma = makeFakePrisma();
  const sut = new ChatMessageMysqlRepository(prisma as never);
  return { sut, prisma };
};

describe("ChatMessage MySql Repository", () => {
  afterEach(() => {
    MockDate.reset();
  });

  test("loadLatest() returns the newest messages of the visible units", async () => {
    const { sut, prisma } = makeSut();
    const messages = await sut.loadLatest([5, 6], 100);
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
      where: { unitStoreId: { in: [5, 6] } },
      include,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    expect(messages).toEqual([makeFakeChatMessage()]);
  });

  test("loadLatest() does not filter by unit when no unit is visible", async () => {
    const { sut, prisma } = makeSut();
    await sut.loadLatest([], 100);
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined }),
    );
  });

  test("add() creates the message with the full include", async () => {
    const { sut, prisma } = makeSut();
    const data = { unitStoreId: 10, senderId: 1, text: "olá", imageBase64: null, imageMimeType: null };
    const message = await sut.add(data);
    expect(prisma.chatMessage.create).toHaveBeenCalledWith({ data, include });
    expect(message).toEqual(makeFakeChatMessage());
  });

  test("loadPage() without filter queries every message", async () => {
    const { sut, prisma } = makeSut();
    const result = await sut.loadPage({}, { limit: 2, offset: 4 });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
      where: {},
      include,
      orderBy: { createdAt: "desc" },
      take: 2,
      skip: 4,
    });
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({ messages: [makeFakeChatMessage()], total: 1 });
  });

  test("loadPage() prefers a single unitStoreId over the visible list", async () => {
    const { sut, prisma } = makeSut();
    await sut.loadPage({ unitStoreIds: [10, 11] }, { limit: 2, offset: 0 });
    expect(prisma.chatMessage.count).toHaveBeenLastCalledWith({ where: { unitStoreId: { in: [10, 11] } } });
    await sut.loadPage({ unitStoreIds: [10, 11], unitStoreId: 11 }, { limit: 2, offset: 0 });
    expect(prisma.chatMessage.count).toHaveBeenLastCalledWith({ where: { unitStoreId: 11 } });
  });

  test("loadPage() translates every search criterion", async () => {
    const { sut, prisma } = makeSut();
    const createdFrom = new Date("2026-11-01T00:00:00.000Z");
    const createdTo = new Date("2026-11-06T23:59:59.999Z");
    await sut.loadPage(
      {
        senderId: 3,
        createdFrom,
        createdTo,
        withImage: true,
        withText: true,
        searchText: "pedido",
      },
      { limit: 50, offset: 0 },
    );
    const contains = { contains: "pedido", mode: "insensitive" };
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({
      where: {
        senderId: 3,
        createdAt: { gte: createdFrom, lte: createdTo },
        imageBase64: { not: null },
        text: { not: null },
        OR: [{ text: contains }, { sender: { name: contains } }, { unitStore: { name: contains } }],
      },
    });
  });

  test("loadPage() builds partial date ranges", async () => {
    const { sut, prisma } = makeSut();
    const createdTo = new Date("2026-11-06T23:59:59.999Z");
    await sut.loadPage({ createdTo }, { limit: 50, offset: 0 });
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({ where: { createdAt: { lte: createdTo } } });
  });

  test("loadById() uses the full include", async () => {
    const { sut, prisma } = makeSut();
    await sut.loadById(5);
    expect(prisma.chatMessage.findUnique).toHaveBeenCalledWith({ where: { id: 5 }, include });
  });

  test("loadOwnership() loads only the sender id and role", async () => {
    const { sut, prisma } = makeSut();
    await sut.loadOwnership(5);
    expect(prisma.chatMessage.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      include: { sender: { select: { id: true, role: true } } },
    });
  });

  test("updateText() updates only the text", async () => {
    const { sut, prisma } = makeSut();
    await sut.updateText(5, "editado");
    expect(prisma.chatMessage.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { text: "editado" },
      include,
    });
  });

  test("deleteById() deletes by id", async () => {
    const { sut, prisma } = makeSut();
    await sut.deleteById(5);
    expect(prisma.chatMessage.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  test("loadStatistics() aggregates the scope and 24 hourly buckets", async () => {
    MockDate.set(new Date("2026-11-06T15:00:00.000Z"));
    const { sut, prisma } = makeSut();
    prisma.chatMessage.findMany
      .mockResolvedValueOnce([{ senderId: 1 }, { senderId: 2 }])
      .mockResolvedValueOnce([{ unitStoreId: 10 }]);
    prisma.chatMessage.findFirst.mockResolvedValueOnce({
      id: 9,
      text: "último",
      createdAt: new Date("2026-11-06T14:00:00.000Z"),
      sender: { name: "Ana" },
      unitStore: { name: "Matriz" },
    });

    const statistics = await sut.loadStatistics([10, 11]);

    expect(prisma.chatMessage.count).toHaveBeenNthCalledWith(1, { where: { unitStoreId: { in: [10, 11] } } });
    expect(prisma.chatMessage.count).toHaveBeenNthCalledWith(2, {
      where: { unitStoreId: { in: [10, 11] }, imageBase64: { not: null } },
    });
    expect(prisma.chatMessage.count).toHaveBeenCalledTimes(28);
    expect(statistics).toEqual(
      expect.objectContaining({
        totalMessages: 1,
        uniqueSenders: 2,
        activeUnits: 1,
        lastMessage: {
          id: 9,
          text: "último",
          sender: "Ana",
          unit: "Matriz",
          createdAt: new Date("2026-11-06T14:00:00.000Z"),
        },
      }),
    );
    expect(statistics.messagesByHour).toHaveLength(24);
    expect(statistics.messagesByHour[0]).toEqual({ hour: 23, count: 1 });
  });

  test("loadStatistics() without units queries everything and handles no last message", async () => {
    const { sut, prisma } = makeSut();
    prisma.chatMessage.findMany.mockResolvedValue([]);
    const statistics = await sut.loadStatistics();
    expect(prisma.chatMessage.count).toHaveBeenNthCalledWith(1, { where: undefined });
    expect(statistics.lastMessage).toBeNull();
  });
});
