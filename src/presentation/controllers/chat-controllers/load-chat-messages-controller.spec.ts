import { ChatAccountNotFoundError } from "../../../domain/errors";
import { LoadChatMessages } from "../../../domain/usescases/chat/load-chat-messages";
import { makeFakeChatMessage } from "../../../test/chat-fixtures";
import { LoadChatMessagesController } from "./load-chat-messages-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makePage = () => ({
  messages: [makeFakeChatMessage()],
  pagination: { total: 1, limit: 100, offset: 0, hasMore: false },
});

const makeSut = () => {
  const loadChatMessagesStub: LoadChatMessages = {
    load: jest.fn().mockResolvedValue(makePage()),
  };
  return { sut: new LoadChatMessagesController(loadChatMessagesStub), loadChatMessagesStub };
};

describe("LoadChatMessages Controller", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should return 401 without accountId", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ headers: {} });
    expect(response).toEqual({ statusCode: 401, body: { error: "Não autenticado" } });
  });

  test("Should use default pagination values", async () => {
    const { sut, loadChatMessagesStub } = makeSut();
    await sut.handle({ actor: makeFakeActor(), query: {} });
    expect(loadChatMessagesStub.load).toHaveBeenCalledWith({
      accountId: 1,
      limit: 100,
      offset: 0,
      unitStoreId: undefined,
    });
  });

  test("Should parse the query values", async () => {
    const { sut, loadChatMessagesStub } = makeSut();
    await sut.handle({ actor: makeFakeActor(), query: { limit: "2", offset: "4", unitStoreId: "11" } });
    expect(loadChatMessagesStub.load).toHaveBeenCalledWith({
      accountId: 1,
      limit: 2,
      offset: 4,
      unitStoreId: 11,
    });
  });

  test("Should return 200 with the page", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 200, body: makePage() });
  });

  test("Should return 404 when the account does not exist", async () => {
    const { sut, loadChatMessagesStub } = makeSut();
    const error = new ChatAccountNotFoundError();
    (loadChatMessagesStub.load as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 404, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, loadChatMessagesStub } = makeSut();
    (loadChatMessagesStub.load as jest.Mock).mockRejectedValueOnce(new Error("db down"));
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao carregar mensagens" } });
  });
});
