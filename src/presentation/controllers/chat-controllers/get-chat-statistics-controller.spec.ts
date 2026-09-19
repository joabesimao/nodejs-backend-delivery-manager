import { GetChatStatisticsController } from "./get-chat-statistics-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
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
  visibleUnitIds: [10],
});

const makeFakeLastMessage = () => ({
  id: 1,
  text: "hi",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  sender: { name: "John" },
  unitStore: { name: "Store A" },
});

const makeSut = (): GetChatStatisticsController => new GetChatStatisticsController();

describe("GetChatStatistics Controller", () => {
  beforeEach(() => {
    (prisma.chatMessage.count as jest.Mock).mockResolvedValue(5);
    (prisma.chatMessage.findMany as jest.Mock)
      .mockResolvedValueOnce([{ senderId: 1 }, { senderId: 2 }])
      .mockResolvedValueOnce([{ unitStoreId: 10 }]);
    (prisma.chatMessage.findFirst as jest.Mock).mockResolvedValue(makeFakeLastMessage());
    (getAccountScope as jest.Mock).mockResolvedValue(makeFakeScope());
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

  test("Should not call getAccountScope when no accountId is provided", async () => {
    const sut = makeSut();
    await sut.handle({ headers: {}, query: {} });
    expect(getAccountScope).not.toHaveBeenCalled();
  });

  test("Should use accountId from query when header is not provided", async () => {
    const sut = makeSut();
    await sut.handle({ headers: {}, query: { accountId: 1 } });
    expect(getAccountScope).toHaveBeenCalledWith(prisma, 1);
  });

  test("Should return 200 with statistics on success", async () => {
    const sut = makeSut();
    const httpRequest: HttpRequest = { headers: { accountId: 1 }, query: {} };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.statistics.totalMessages).toBe(5);
    expect(httpResponse.body.statistics.messagesWithImages).toBe(5);
    expect(httpResponse.body.statistics.messagesWithText).toBe(5);
    expect(httpResponse.body.statistics.messagesToday).toBe(5);
    expect(httpResponse.body.statistics.uniqueSenders).toBe(2);
    expect(httpResponse.body.statistics.activeUnits).toBe(1);
    expect(httpResponse.body.statistics.lastMessage).toEqual({
      id: 1,
      text: "hi",
      sender: "John",
      unit: "Store A",
      createdAt: makeFakeLastMessage().createdAt,
    });
    expect(httpResponse.body.statistics.messagesByHour).toHaveLength(24);
    expect(httpResponse.body.statistics.messagesByHour[0]).toEqual({ hour: 23, count: 5 });
  });

  test("Should return lastMessage as null when there is no last message", async () => {
    (prisma.chatMessage.findFirst as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, query: {} });
    expect(httpResponse.body.statistics.lastMessage).toBeNull();
  });

  test("Should succeed without accountId, using an undefined whereClause", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, query: {} });
    expect(httpResponse.statusCode).toBe(200);
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({ where: undefined });
  });

  test("Should return 200 when request has no headers or query at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse.statusCode).toBe(200);
    expect(getAccountScope).not.toHaveBeenCalled();
  });

  test("Should return 500 if prisma throws", async () => {
    (prisma.chatMessage.count as jest.Mock).mockRejectedValueOnce(new Error());
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, query: {} });
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao carregar estatísticas" },
    });
  });
});
