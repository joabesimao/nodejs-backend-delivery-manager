import { LoadChatMessageByIdController } from "./load-chat-message-by-id-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../../main/realtime/store-scope", () => ({
  getAccountScope: jest.fn(),
}));

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
  params: { id: 5 },
});

const makeFakeMessage = () => ({
  id: 5,
  unitStoreId: 10,
  senderId: 1,
  text: "hello",
  imageBase64: null,
  imageMimeType: null,
  sender: { id: 1, name: "any_name", email: "any_email", role: "user", unitStoreId: 10 },
  unitStore: { id: 10, name: "any_store" },
});

const makeFakeScope = () => ({
  accountId: 1,
  role: "principal" as const,
  unitStoreId: 10,
  rootStoreId: 10,
  visibleUnitIds: [10],
});

const makeSut = (): LoadChatMessageByIdController => new LoadChatMessageByIdController();

describe("LoadChatMessageById Controller", () => {
  beforeEach(() => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue(makeFakeMessage());
    (getAccountScope as jest.Mock).mockResolvedValue(makeFakeScope());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 401 if accountId is not provided", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, params: { id: 5 } });
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 400 if messageId is invalid", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: { accountId: 1 }, params: {} });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "ID de mensagem inválido" },
    });
  });

  test("Should call prisma.chatMessage.findUnique with correct id", async () => {
    const sut = makeSut();
    await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
    );
  });

  test("Should return 404 if message is not found", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 404,
      body: { error: "Mensagem não encontrada" },
    });
  });

  test("Should return 403 if scope is not found", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para acessar essa mensagem" },
    });
  });

  test("Should return 403 if message unitStoreId is not in visible units", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce({
      ...makeFakeScope(),
      visibleUnitIds: [99],
    });
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para acessar essa mensagem" },
    });
  });

  test("Should return 200 with the message on success", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: makeFakeMessage(),
    });
  });

  test("Should return 401 when request has no headers or params at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 500 if prisma throws", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockRejectedValueOnce(new Error());
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao carregar mensagem" },
    });
  });
});
