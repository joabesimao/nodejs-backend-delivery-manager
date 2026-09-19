import { LoadChatMessagesController } from "./load-chat-messages-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";
// Lightweight touch of the chat-usecases barrel file so its pure re-exports
// (interfaces with no runtime logic) are counted as covered.
import "../../../data/usescases/chat-usecases";

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

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
  query: {},
});

const makeSut = (): LoadChatMessagesController => new LoadChatMessagesController();

describe("LoadChatMessages Controller", () => {
  beforeEach(() => {
    (getAccountScope as jest.Mock).mockResolvedValue(makeFakeScope());
    (prisma.chatMessage.findMany as jest.Mock).mockResolvedValue(makeFakeMessages());
    (prisma.chatMessage.count as jest.Mock).mockResolvedValue(2);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 401 if accountId is not provided", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, query: {} });
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 404 if scope is not found", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: { error: "Conta não encontrada" },
    });
  });

  test("Should use default limit and offset when not provided", async () => {
    const sut = makeSut();
    await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100, skip: 0 })
    );
  });

  test("Should filter by visible units from scope", async () => {
    const sut = makeSut();
    await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { unitStoreId: { in: [10, 11] } },
      })
    );
  });

  test("Should not filter by unitStoreId when scope has no visible units", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce({
      ...makeFakeScope(),
      visibleUnitIds: [],
    });
    const sut = makeSut();
    await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  test("Should filter by specific unitStoreId when provided and visible", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { unitStoreId: 11 },
    });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { unitStoreId: 11 } })
    );
  });

  test("Should ignore unitStoreId query when it is not visible to the account", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { unitStoreId: 999 },
    });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { unitStoreId: { in: [10, 11] } } })
    );
  });

  test("Should return 200 with reversed messages and pagination", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        messages: [...makeFakeMessages()].reverse(),
        pagination: {
          total: 2,
          limit: 100,
          offset: 0,
          hasMore: false,
        },
      },
    });
  });

  test("Should use default limit and offset when query is entirely absent", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: { accountId: 1 } });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100, skip: 0 })
    );
    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should use a provided non-zero offset", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      query: { limit: 10, offset: 20 },
    });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10, skip: 20 })
    );
  });

  test("Should compute hasMore as true when there are more messages than the page", async () => {
    (prisma.chatMessage.count as jest.Mock).mockResolvedValueOnce(50);
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      query: { limit: 10, offset: 0 },
    });
    expect(httpResponse.body.pagination).toEqual({
      total: 50,
      limit: 10,
      offset: 0,
      hasMore: true,
    });
  });

  test("Should return 401 when request has no headers or query at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 500 with details if prisma throws", async () => {
    (prisma.chatMessage.findMany as jest.Mock).mockRejectedValueOnce(new Error("boom"));
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao carregar mensagens", details: String(new Error("boom")) },
    });
  });
});
