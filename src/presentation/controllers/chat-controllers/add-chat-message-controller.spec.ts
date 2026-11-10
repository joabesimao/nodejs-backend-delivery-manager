import { ChatPermissionDeniedError } from "../../../domain/errors";
import { AddChatMessage } from "../../../domain/usescases/chat/add-chat-message";
import { makeFakeChatMessage } from "../../../test/chat-fixtures";
import { HttpRequest } from "../../protocols/http";
import { AddChatMessageController } from "./add-chat-message-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makeRequest = (body: Record<string, unknown> = { text: " olá ", unitStoreId: 11 }): HttpRequest => ({
  actor: makeFakeActor(),
  body,
});

const makeSut = () => {
  const addChatMessageStub: AddChatMessage = {
    add: jest.fn().mockResolvedValue(makeFakeChatMessage()),
  };
  return { sut: new AddChatMessageController(addChatMessageStub), addChatMessageStub };
};

describe("AddChatMessage Controller", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should return 401 without accountId", async () => {
    const { sut, addChatMessageStub } = makeSut();
    const response = await sut.handle({ headers: {}, body: { text: "oi" } });
    expect(response).toEqual({ statusCode: 401, body: { error: "Não autenticado" } });
    expect(addChatMessageStub.add).not.toHaveBeenCalled();
  });

  test("Should return 400 when text and image are empty", async () => {
    const { sut, addChatMessageStub } = makeSut();
    const response = await sut.handle(makeRequest({ text: "   " }));
    expect(response).toEqual({ statusCode: 400, body: { error: "Mensagem não pode estar vazia" } });
    expect(addChatMessageStub.add).not.toHaveBeenCalled();
  });

  test("Should call AddChatMessage with the parsed values", async () => {
    const { sut, addChatMessageStub } = makeSut();
    await sut.handle(
      makeRequest({ text: " olá ", unitStoreId: "11", imageBase64: "QUJD", imageMimeType: "image/png" }),
    );
    expect(addChatMessageStub.add).toHaveBeenCalledWith({
      accountId: 1,
      unitStoreId: 11,
      text: "olá",
      imageBase64: "QUJD",
      imageMimeType: "image/png",
    });
  });

  test("Should send null text when only an image is sent", async () => {
    const { sut, addChatMessageStub } = makeSut();
    await sut.handle(makeRequest({ imageBase64: "QUJD" }));
    expect(addChatMessageStub.add).toHaveBeenCalledWith(
      expect.objectContaining({ text: null, unitStoreId: 0, imageMimeType: null }),
    );
  });

  test("Should return 201 with the created message", async () => {
    const { sut } = makeSut();
    const response = await sut.handle(makeRequest());
    expect(response).toEqual({ statusCode: 201, body: makeFakeChatMessage() });
  });

  test("Should map domain errors", async () => {
    const { sut, addChatMessageStub } = makeSut();
    const error = new ChatPermissionDeniedError("Sem permissão para enviar para essa loja");
    (addChatMessageStub.add as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle(makeRequest());
    expect(response).toEqual({ statusCode: 403, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, addChatMessageStub } = makeSut();
    (addChatMessageStub.add as jest.Mock).mockRejectedValueOnce(new Error("db down"));
    const response = await sut.handle(makeRequest());
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao enviar mensagem" } });
  });
});
