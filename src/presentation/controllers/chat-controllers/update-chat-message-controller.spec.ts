import { UpdateChatMessageController } from "./update-chat-message-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    account: {
      findUnique: jest.fn(),
    },
  },
}));

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
  params: { id: 5 },
  body: { text: "updated_text" },
});

const makeFakeMessage = () => ({
  id: 5,
  senderId: 1,
  imageBase64: null,
  sender: { id: 1, role: "user" },
});

const makeFakeUpdatedMessage = () => ({
  id: 5,
  unitStoreId: 10,
  senderId: 1,
  text: "updated_text",
  imageBase64: null,
  imageMimeType: null,
  sender: { id: 1, name: "any_name", email: "any_email", role: "user", unitStoreId: 10 },
  unitStore: { id: 10, name: "any_store" },
});

const makeSut = (): UpdateChatMessageController => new UpdateChatMessageController();

describe("UpdateChatMessage Controller", () => {
  beforeEach(() => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue(makeFakeMessage());
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({ role: "user" });
    (prisma.chatMessage.update as jest.Mock).mockResolvedValue(makeFakeUpdatedMessage());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 401 if accountId is not provided", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, params: { id: 5 }, body: {} });
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 400 if messageId is invalid", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      params: {},
      body: {},
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "ID de mensagem inválido" },
    });
  });

  test("Should return 400 if text trims to an empty string", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      params: { id: 5 },
      body: { text: "   " },
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "Texto da mensagem não pode estar vazio" },
    });
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

  test("Should return 403 if account is neither owner nor admin", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      ...makeFakeMessage(),
      senderId: 2,
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce({ role: "user" });
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para editar esta mensagem" },
    });
  });

  test("Should return 400 if resulting message has no text and no image", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      params: { id: 5 },
      body: {},
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "Mensagem não pode ficar vazia" },
    });
  });

  test("Should allow clearing text when message has an image", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      ...makeFakeMessage(),
      imageBase64: "some_base64",
    });
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      params: { id: 5 },
      body: {},
    });
    expect(prisma.chatMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { text: null } })
    );
    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should update message and return 200 when account is the owner", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { text: "updated_text" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            unitStoreId: true,
          },
        },
        unitStore: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: makeFakeUpdatedMessage(),
    });
  });

  test("Should update message and return 200 when account is admin but not owner", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      ...makeFakeMessage(),
      senderId: 2,
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce({ role: "admin" });
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(200);
  });

  test("Should return 401 when request has no headers or params at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 403 if account lookup returns null and account is not the sender", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      ...makeFakeMessage(),
      senderId: 2,
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para editar esta mensagem" },
    });
  });

  test("Should return 500 if prisma throws", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockRejectedValueOnce(new Error());
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao atualizar mensagem" },
    });
  });
});
