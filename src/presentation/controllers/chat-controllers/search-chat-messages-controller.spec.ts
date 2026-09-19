import { SearchChatMessagesController } from "./search-chat-messages-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("../../../main/realtime/store-scope", () => ({
  getAccountScope: jest.fn(),
}));

const makeFakeScope = () => ({
  accountId: 1,
  role: "principal" as const,
  unitStoreId: 10,
  rootStoreId: 10,
  visibleUnitIds: [10, 11],
});

const makeFakeMessages = () => [
  { id: 1, unitStoreId: 10, text: "a" },
  { id: 2, unitStoreId: 10, text: "b" },
];

const makeSut = (): SearchChatMessagesController => new SearchChatMessagesController();

describe("SearchChatMessages Controller", () => {
  beforeEach(() => {
    (getAccountScope as jest.Mock).mockResolvedValue(makeFakeScope());
    (prisma.chatMessage.findMany as jest.Mock).mockResolvedValue(makeFakeMessages());
    (prisma.chatMessage.count as jest.Mock).mockResolvedValue(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 404 if accountId is provided but scope is not found", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: { accountId: 1 }, query: {} });
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: { error: "Conta não encontrada" },
    });
  });

  test("Should succeed without accountId and without calling getAccountScope", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, query: {} });
    expect(getAccountScope).not.toHaveBeenCalled();
    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should filter by visible units from scope", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: {} });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ unitStoreId: { in: [10, 11] } }),
      })
    );
  });

  test("Should filter by specific unitStoreId when visible", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: { unitStoreId: "11" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ unitStoreId: 11 }),
      })
    );
  });

  test("Should ignore unitStoreId filter when not visible to the account", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: { unitStoreId: "999" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { unitStoreId: { in: [10, 11] } },
      })
    );
  });

  test("Should allow unitStoreId filter when there is no scope", async () => {
    const sut = makeSut();
    await sut.handle({ headers: {}, query: { unitStoreId: "77" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { unitStoreId: 77 },
      })
    );
  });

  test("Should filter by senderId when provided", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: { senderId: "3" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ senderId: 3 }),
      })
    );
  });

  test("Should filter by dateFrom and dateTo range", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { dateFrom: "2026-01-01", dateTo: "2026-01-31" },
    });
    const callArgs = (prisma.chatMessage.findMany as jest.Mock).mock.calls[0][0];
    expect(callArgs.where.createdAt.gte).toEqual(new Date("2026-01-01"));
    expect(callArgs.where.createdAt.lte.getHours()).toBe(23);
    expect(callArgs.where.createdAt.lte.getMinutes()).toBe(59);
  });

  test("Should filter only by dateFrom when dateTo is not provided", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { dateFrom: "2026-01-01" },
    });
    const callArgs = (prisma.chatMessage.findMany as jest.Mock).mock.calls[0][0];
    expect(callArgs.where.createdAt.gte).toEqual(new Date("2026-01-01"));
    expect(callArgs.where.createdAt.lte).toBeUndefined();
  });

  test("Should filter by hasImage and hasText flags", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { hasImage: "true", hasText: "true" },
    });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          imageBase64: { not: null },
          text: { not: null },
        }),
      })
    );
  });

  test("Should build OR clause when searchText (q) is provided", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: { q: "hello" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { text: { contains: "hello" } },
            { sender: { name: { contains: "hello" } } },
            { unitStore: { name: { contains: "hello" } } },
          ],
        }),
      })
    );
  });

  test("Should clamp limit to a maximum of 100", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: { limit: "500" } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 })
    );
  });

  test("Should use default limit of 50 when not provided", async () => {
    const sut = makeSut();
    await sut.handle({ headers: { accountId: 1 }, query: {} });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 })
    );
  });

  test("Should return 200 with reversed messages and pagination on success", async () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = { headers: { accountId: 1 }, query: {} };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        messages: [...makeFakeMessages()].reverse(),
        pagination: {
          total: 2,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
      },
    });
  });

  test("Should return 200 when request has no headers or query at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse.statusCode).toBe(200);
    expect(getAccountScope).not.toHaveBeenCalled();
  });

  test("Should return 500 if prisma throws", async () => {
    (prisma.chatMessage.findMany as jest.Mock).mockRejectedValueOnce(new Error());
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: { accountId: 1 }, query: {} });
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao buscar mensagens" },
    });
  });
});
