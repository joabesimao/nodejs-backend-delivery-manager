import { ChatAccountNotFoundError } from "../../../domain/errors";
import { SearchChatMessages } from "../../../domain/usescases/chat/search-chat-messages";
import { SearchChatMessagesController } from "./search-chat-messages-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makePage = () => ({
  messages: [],
  pagination: { total: 0, limit: 50, offset: 0, hasMore: false },
});

const makeSut = () => {
  const searchChatMessagesStub: SearchChatMessages = {
    search: jest.fn().mockResolvedValue(makePage()),
  };
  return { sut: new SearchChatMessagesController(searchChatMessagesStub), searchChatMessagesStub };
};

describe("SearchChatMessages Controller", () => {
  test("Should use default values when the query is empty", async () => {
    const { sut, searchChatMessagesStub } = makeSut();
    await sut.handle({ actor: makeFakeActor() });
    expect(searchChatMessagesStub.search).toHaveBeenCalledWith({
      accountId: 1,
      searchText: "",
      unitStoreId: 0,
      senderId: 0,
      limit: 50,
      offset: 0,
      dateFrom: undefined,
      dateTo: undefined,
      hasImage: false,
      hasText: false,
    });
  });

  test("Should parse the query and cap the limit at 100", async () => {
    const { sut, searchChatMessagesStub } = makeSut();
    await sut.handle({
      headers: {},
      query: {
        accountId: "2",
        q: " pedido ",
        unitStoreId: "11",
        senderId: "3",
        limit: "500",
        offset: "10",
        dateFrom: "2026-11-01T00:00:00.000Z",
        dateTo: "2026-11-06T00:00:00.000Z",
        hasImage: "true",
        hasText: "true",
      },
    });
    expect(searchChatMessagesStub.search).toHaveBeenCalledWith({
      accountId: 2,
      searchText: "pedido",
      unitStoreId: 11,
      senderId: 3,
      limit: 100,
      offset: 10,
      dateFrom: new Date("2026-11-01T00:00:00.000Z"),
      dateTo: new Date("2026-11-06T00:00:00.000Z"),
      hasImage: true,
      hasText: true,
    });
  });

  test("Should return 200 with the page", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 200, body: makePage() });
  });

  test("Should return 404 when the account does not exist", async () => {
    const { sut, searchChatMessagesStub } = makeSut();
    const error = new ChatAccountNotFoundError();
    (searchChatMessagesStub.search as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 404, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, searchChatMessagesStub } = makeSut();
    (searchChatMessagesStub.search as jest.Mock).mockRejectedValueOnce(new Error("db down"));
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao buscar mensagens" } });
  });
});
