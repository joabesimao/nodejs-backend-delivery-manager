import { AddChatMessageController } from "./add-chat-message-controller";
import { HttpRequest } from "../../protocols/http";
import { prisma } from "../../../infra/db/mysql/helpers";
import { getAccountScope } from "../../../main/realtime/store-scope";

jest.mock("../../../infra/db/mysql/helpers", () => ({
  prisma: {
    chatMessage: {
      create: jest.fn(),
    },
  },
}));

jest.mock("../../../main/realtime/store-scope", () => ({
  getAccountScope: jest.fn(),
}));

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
  body: {
    text: "any_text",
    unitStoreId: 10,
  },
});

const makeFakeScope = () => ({
  accountId: 1,
  role: "principal" as const,
  unitStoreId: 10,
  rootStoreId: 10,
  visibleUnitIds: [10, 11],
});

const makeFakeMessage = () => ({
  id: 99,
  unitStoreId: 10,
  senderId: 1,
  text: "any_text",
  imageBase64: null,
  imageMimeType: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  sender: { id: 1, name: "any_name", email: "any_email", role: "user", unitStoreId: 10 },
  unitStore: { id: 10, name: "any_store" },
});

const makeSut = (): AddChatMessageController => new AddChatMessageController();

describe("AddChatMessage Controller", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    (getAccountScope as jest.Mock).mockResolvedValue(makeFakeScope());
    (prisma.chatMessage.create as jest.Mock).mockResolvedValue(makeFakeMessage());
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("Should return 401 if accountId is not provided", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({ headers: {}, body: {} });
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 401 when request has no headers or body at all", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual({
      statusCode: 401,
      body: { error: "Não autenticado" },
    });
  });

  test("Should return 400 if text and imageBase64 are both empty", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      body: {},
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "Mensagem não pode estar vazia" },
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

  test("Should return 403 if unitStoreId is not provided and scope has no visible units", async () => {
    (getAccountScope as jest.Mock).mockResolvedValueOnce({
      ...makeFakeScope(),
      visibleUnitIds: [],
    });
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      body: { text: "any_text" },
    });
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para enviar para nenhuma loja" },
    });
  });

  test("Should default unitStoreId to first visible unit when not provided", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      body: { text: "any_text" },
    });
    expect(prisma.chatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ unitStoreId: 10 }),
      })
    );
  });

  test("Should return 403 if provided unitStoreId is not visible to the account", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      body: { text: "any_text", unitStoreId: 999 },
    });
    expect(httpResponse).toEqual({
      statusCode: 403,
      body: { error: "Sem permissão para enviar para essa loja" },
    });
  });

  test("Should return 400 if image exceeds max size", async () => {
    const sut = makeSut();
    const bigBase64 = "A".repeat(7_000_000);
    const httpResponse = await sut.handle({
      headers: { accountId: 1 },
      body: { imageBase64: bigBase64, unitStoreId: 10 },
    });
    expect(httpResponse).toEqual({
      statusCode: 400,
      body: { error: "Imagem excede o tamanho máximo de 5MB" },
    });
  });

  test("Should normalize base64 image with data URI prefix before saving", async () => {
    const sut = makeSut();
    await sut.handle({
      headers: { accountId: 1 },
      body: {
        imageBase64: "data:image/png;base64,AAAA",
        imageMimeType: "image/png",
        unitStoreId: 10,
      },
    });
    expect(prisma.chatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageBase64: "AAAA",
          imageMimeType: "image/png",
        }),
      })
    );
  });

  test("Should call prisma.chatMessage.create with correct values", async () => {
    const sut = makeSut();
    await sut.handle(makeFakeRequest());
    expect(prisma.chatMessage.create).toHaveBeenCalledWith({
      data: {
        unitStoreId: 10,
        senderId: 1,
        text: "any_text",
        imageBase64: null,
        imageMimeType: null,
      },
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
  });

  test("Should return 201 with created message on success", async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 201,
      body: makeFakeMessage(),
    });
  });

  test("Should return 500 with error message if prisma.chatMessage.create throws", async () => {
    (prisma.chatMessage.create as jest.Mock).mockRejectedValueOnce(
      new Error("db_error")
    );
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "db_error" },
    });
  });

  test("Should return 500 with fallback error message if thrown error has no message", async () => {
    (prisma.chatMessage.create as jest.Mock).mockRejectedValueOnce(new Error(""));
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "Falha ao enviar mensagem" },
    });
  });

  test("Should return 500 if getAccountScope throws a non-Error value", async () => {
    (getAccountScope as jest.Mock).mockRejectedValueOnce("string_error");
    const sut = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual({
      statusCode: 500,
      body: { error: "string_error" },
    });
  });
});
