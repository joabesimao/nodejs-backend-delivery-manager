import { DeleteChatMessageController } from "./delete-chat-message-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    account: {
      findUnique: jest.fn(),
    },
  },
}));

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
  params: { id: 5 },
});

const makeFakeMessage = () => ({
  id: 5,
  senderId: 1,
  sender: { id: 1, role: "user" },
});

const makeSut = (): DeleteChatMessageController => new DeleteChatMessageController();

describe("DeleteChatMessage Controller", () => {
  beforeEach(() => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue(makeFakeMessage());
    (prisma.account.findUnique as jest.Mock).mockResolvedValue({ role: "user" });
    (prisma.chatMessage.delete as jest.Mock).mockResolvedValue({});
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
    expect(prisma.chatMessage.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      include: { sender: { select: { id: true, role: true } } },
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
      id: 5,
      senderId: 2,
      sender: { id: 2, role: "user" },
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce({ role: "user" });
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para deletar esta mensagem" },
    });
  });

  test("Should delete message and return 200 if account is the owner", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.delete).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: { success: true, message: "Mensagem deletada com sucesso" },
    });
  });

  test("Should delete message and return 200 if account is admin but not owner", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 5,
      senderId: 2,
      sender: { id: 2, role: "user" },
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce({ role: "admin" });
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: { success: true, message: "Mensagem deletada com sucesso" },
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

  test("Should return 403 if account lookup returns null and account is not the sender", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 5,
      senderId: 2,
      sender: { id: 2, role: "user" },
    });
    (prisma.account.findUnique as jest.Mock).mockResolvedValueOnce(null);
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para deletar esta mensagem" },
    });
  });

  test("Should return 500 if prisma throws", async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockRejectedValueOnce(new Error());
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao deletar mensagem" },
    });
  });
});
