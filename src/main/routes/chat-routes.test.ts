/**
 * Testes de caracterização: congelam o contrato HTTP atual de /chat/*
 * antes de mover a lógica dos controllers para casos de uso (refatoração clean arch, fase 3).
 *
 * Árvore de lojas usada: 10 (matriz) -> 11 (filial).
 * - admin na loja 10 enxerga [10, 11] (escopo "principal")
 * - user na loja 11 enxerga só [11] (escopo "branch")
 */
import request from "supertest";
import MockDate from "mockdate";
import {
  PrismaMock,
  makeAccessToken,
  makeFakeAccount,
  mockAuthenticatedAccount,
  mockUnitStoreTree,
} from "../../test/route-harness";
import { prisma as prismaClient } from "../../infra/db/prisma/client";
import app from "../config/app";

jest.mock("../../infra/db/prisma/client", () => ({
  prisma: jest.requireActual("../../test/route-harness").createPrismaMock(),
}));

const mockNotify = jest.fn();
jest.mock("../factories/notify-chat-message", () => ({
  makeNotifyChatMessage: () => ({
    notify: async (...args: unknown[]) => mockNotify(...args),
  }),
}));

const prisma = prismaClient as unknown as PrismaMock;

const admin = makeFakeAccount({ id: 1, role: "admin", unitStoreId: 10 });
const branchUser = makeFakeAccount({ id: 1, role: "user", unitStoreId: 11 });

const makeMessage = (overrides: Record<string, unknown> = {}) => ({
  id: 5,
  unitStoreId: 11,
  senderId: 1,
  text: "olá",
  imageBase64: null,
  imageMimeType: null,
  createdAt: "2026-11-06T12:00:00.000Z",
  sender: {
    id: 1,
    name: "Conta Teste",
    email: "conta@teste.com",
    role: "admin",
    unitStoreId: 10,
  },
  unitStore: { id: 11, name: "Filial" },
  ...overrides,
});

const messageInclude = {
  sender: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      unitStoreId: true,
    },
  },
  unitStore: { select: { id: true, name: true } },
};

let token: string;

/**
 * Os controllers do chat respondem `{ error: "<mensagem>" }` e o `adaptRoute`
 * repassa essa mensagem ao cliente (fix/chat-mensagem-de-erro).
 */
const expectChatError = (
  response: request.Response,
  status: number,
  message: string,
): void => {
  expect(response.status).toBe(status);
  expect(response.body).toEqual({ error: message });
};

beforeAll(async () => {
  token = await makeAccessToken(1);
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "info").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  mockAuthenticatedAccount(prisma, admin);
  mockUnitStoreTree(prisma, { 10: null, 11: 10 });
  mockNotify.mockResolvedValue(undefined);
});

afterEach(() => {
  MockDate.reset();
});

describe("Autenticação do chat", () => {
  test.each([
    ["get", "/chat/messages"],
    ["get", "/chat/search"],
    ["get", "/chat/messages/5"],
    ["post", "/chat/messages"],
    ["put", "/chat/messages/5"],
    ["delete", "/chat/messages/5"],
    ["get", "/chat/statistics"],
  ] as const)("%s %s responde 401 sem token", async (method, path) => {
    const response = await request(app)[method](`/api${path}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });
});

describe("GET /api/chat/messages", () => {
  test("lista as mensagens das lojas visíveis em ordem cronológica, com paginação", async () => {
    prisma.chatMessage.findMany.mockResolvedValue([
      makeMessage({ id: 2 }),
      makeMessage({ id: 1 }),
    ]);
    prisma.chatMessage.count.mockResolvedValue(3);

    const response = await request(app)
      .get("/api/chat/messages")
      .query({ limit: 2 })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.messages.map((m: { id: number }) => m.id)).toEqual([
      1, 2,
    ]);
    expect(response.body.pagination).toEqual({
      total: 3,
      limit: 2,
      offset: 0,
      hasMore: true,
    });
    expect(prisma.chatMessage.findMany).toHaveBeenCalledWith({
      where: { unitStoreId: { in: [10, 11] } },
      include: messageInclude,
      orderBy: { createdAt: "desc" },
      take: 2,
      skip: 0,
    });
  });

  test("unitStoreId visível restringe a uma loja; fora do escopo é ignorado", async () => {
    prisma.chatMessage.findMany.mockResolvedValue([]);
    prisma.chatMessage.count.mockResolvedValue(0);

    await request(app)
      .get("/api/chat/messages")
      .query({ unitStoreId: 11 })
      .set("x-access-token", token);
    expect(prisma.chatMessage.count).toHaveBeenLastCalledWith({
      where: { unitStoreId: 11 },
    });

    await request(app)
      .get("/api/chat/messages")
      .query({ unitStoreId: 99 })
      .set("x-access-token", token);
    expect(prisma.chatMessage.count).toHaveBeenLastCalledWith({
      where: { unitStoreId: { in: [10, 11] } },
    });
  });

  test("conta de filial só enxerga a própria loja; padrão de 100 itens", async () => {
    mockAuthenticatedAccount(prisma, branchUser);
    prisma.chatMessage.findMany.mockResolvedValue([]);
    prisma.chatMessage.count.mockResolvedValue(0);

    const response = await request(app)
      .get("/api/chat/messages")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.pagination).toEqual({
      total: 0,
      limit: 100,
      offset: 0,
      hasMore: false,
    });
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({
      where: { unitStoreId: { in: [11] } },
    });
  });

  test("erro no banco responde 500", async () => {
    prisma.chatMessage.findMany.mockRejectedValue(new Error("db down"));
    prisma.chatMessage.count.mockResolvedValue(0);

    const response = await request(app)
      .get("/api/chat/messages")
      .set("x-access-token", token);

    expectChatError(response, 500, "Falha ao carregar mensagens");
  });
});

describe("GET /api/chat/search", () => {
  test("aplica texto, remetente, datas, flags e limite máximo de 100", async () => {
    prisma.chatMessage.findMany.mockResolvedValue([makeMessage()]);
    prisma.chatMessage.count.mockResolvedValue(1);

    const response = await request(app)
      .get("/api/chat/search")
      .query({
        q: " pedido ",
        senderId: 3,
        dateFrom: "2026-11-01T00:00:00.000Z",
        hasImage: "true",
        hasText: "true",
        limit: 500,
        offset: 10,
      })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.pagination).toEqual({
      total: 1,
      limit: 100,
      offset: 10,
      hasMore: false,
    });
    const contains = { contains: "pedido", mode: "insensitive" };
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({
      where: {
        unitStoreId: { in: [10, 11] },
        senderId: 3,
        createdAt: { gte: new Date("2026-11-01T00:00:00.000Z") },
        imageBase64: { not: null },
        text: { not: null },
        OR: [
          { text: contains },
          { sender: { name: contains } },
          { unitStore: { name: contains } },
        ],
      },
    });
  });

  test("dateTo vai até o fim do dia (horário local)", async () => {
    prisma.chatMessage.findMany.mockResolvedValue([]);
    prisma.chatMessage.count.mockResolvedValue(0);

    await request(app)
      .get("/api/chat/search")
      .query({ dateTo: "2026-11-06T12:00:00.000Z" })
      .set("x-access-token", token);

    const endOfDay = new Date("2026-11-06T12:00:00.000Z");
    endOfDay.setHours(23, 59, 59, 999);
    expect(prisma.chatMessage.count).toHaveBeenCalledWith({
      where: { unitStoreId: { in: [10, 11] }, createdAt: { lte: endOfDay } },
    });
  });

  test("erro no banco responde 500", async () => {
    prisma.chatMessage.findMany.mockRejectedValue(new Error("db down"));
    prisma.chatMessage.count.mockResolvedValue(0);

    const response = await request(app)
      .get("/api/chat/search")
      .set("x-access-token", token);

    expectChatError(response, 500, "Falha ao buscar mensagens");
  });
});

describe("GET /api/chat/messages/:id", () => {
  test("retorna a mensagem quando está no escopo", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(makeMessage());

    const response = await request(app)
      .get("/api/chat/messages/5")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(makeMessage());
    expect(prisma.chatMessage.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      include: messageInclude,
    });
  });

  test("id inválido responde 400", async () => {
    const response = await request(app)
      .get("/api/chat/messages/abc")
      .set("x-access-token", token);
    expectChatError(response, 400, "ID de mensagem inválido");
  });

  test("mensagem inexistente responde 404", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(null);
    const response = await request(app)
      .get("/api/chat/messages/5")
      .set("x-access-token", token);
    expectChatError(response, 404, "Mensagem não encontrada");
  });

  test("mensagem de outra loja responde 403", async () => {
    mockAuthenticatedAccount(prisma, branchUser);
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ unitStoreId: 10 }),
    );

    const response = await request(app)
      .get("/api/chat/messages/5")
      .set("x-access-token", token);

    expectChatError(response, 403, "Sem permissão para acessar essa mensagem");
  });
});

describe("POST /api/chat/messages", () => {
  test("cria a mensagem na primeira loja visível e dispara a notificação", async () => {
    prisma.chatMessage.create.mockResolvedValue(
      makeMessage({ unitStoreId: 10, unitStore: { id: 10, name: "Matriz" } }),
    );

    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({ text: "  olá  " });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(5);
    expect(prisma.chatMessage.create).toHaveBeenCalledWith({
      data: {
        unitStoreId: 10,
        senderId: 1,
        text: "olá",
        imageBase64: null,
        imageMimeType: null,
      },
      include: messageInclude,
    });
    expect(mockNotify).toHaveBeenCalledWith({
      messageId: 5,
      unitStoreId: 10,
      unitStoreName: "Matriz",
      senderId: 1,
      senderName: "Conta Teste",
      text: "olá",
      hasImage: false,
    });
  });

  test("remove o prefixo data: da imagem antes de salvar", async () => {
    prisma.chatMessage.create.mockResolvedValue(
      makeMessage({ imageBase64: "QUJD" }),
    );

    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({
        imageBase64: "data:image/png;base64,QUJD",
        imageMimeType: "image/png",
        unitStoreId: 11,
      });

    expect(response.status).toBe(201);
    expect(prisma.chatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          unitStoreId: 11,
          senderId: 1,
          text: null,
          imageBase64: "QUJD",
          imageMimeType: "image/png",
        },
      }),
    );
  });

  test("mensagem vazia responde 400", async () => {
    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({ text: "   " });
    expectChatError(response, 400, "Mensagem não pode estar vazia");
  });

  test("imagem acima de 5MB responde 400", async () => {
    const bigImage = "A".repeat(Math.ceil((5 * 1024 * 1024 * 4) / 3) + 8);
    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({ imageBase64: bigImage });

    expectChatError(response, 400, "Imagem excede o tamanho máximo de 5MB");
    expect(prisma.chatMessage.create).not.toHaveBeenCalled();
  });

  test("loja fora do escopo responde 403", async () => {
    mockAuthenticatedAccount(prisma, branchUser);
    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({ text: "oi", unitStoreId: 10 });

    expectChatError(response, 403, "Sem permissão para enviar para essa loja");
  });

  test("conta sem loja responde 403", async () => {
    mockAuthenticatedAccount(
      prisma,
      makeFakeAccount({ id: 1, role: "admin", unitStoreId: null }),
    );
    const response = await request(app)
      .post("/api/chat/messages")
      .set("x-access-token", token)
      .send({ text: "oi" });

    expectChatError(
      response,
      403,
      "Sem permissão para enviar para nenhuma loja",
    );
  });
});

describe("PUT /api/chat/messages/:id", () => {
  test("autor edita o texto", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ senderId: 1 }),
    );
    prisma.chatMessage.update.mockResolvedValue(
      makeMessage({ text: "editado" }),
    );
    mockAuthenticatedAccount(prisma, branchUser);

    const response = await request(app)
      .put("/api/chat/messages/5")
      .set("x-access-token", token)
      .send({ text: " editado " });

    expect(response.status).toBe(200);
    expect(response.body.text).toBe("editado");
    expect(prisma.chatMessage.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { text: "editado" },
      include: messageInclude,
    });
  });

  test("quem não é autor nem admin responde 403", async () => {
    mockAuthenticatedAccount(prisma, branchUser);
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ senderId: 99 }),
    );

    const response = await request(app)
      .put("/api/chat/messages/5")
      .set("x-access-token", token)
      .send({ text: "x" });

    expectChatError(response, 403, "Sem permissão para editar esta mensagem");
  });

  test("texto só com espaços responde 400", async () => {
    const response = await request(app)
      .put("/api/chat/messages/5")
      .set("x-access-token", token)
      .send({ text: "  " });
    expectChatError(response, 400, "Texto da mensagem não pode estar vazio");
  });

  test("apagar o texto de mensagem sem imagem responde 400", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ senderId: 1, imageBase64: null }),
    );

    const response = await request(app)
      .put("/api/chat/messages/5")
      .set("x-access-token", token)
      .send({});

    expectChatError(response, 400, "Mensagem não pode ficar vazia");
  });

  test("mensagem inexistente responde 404", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(null);
    const response = await request(app)
      .put("/api/chat/messages/5")
      .set("x-access-token", token)
      .send({ text: "x" });
    expectChatError(response, 404, "Mensagem não encontrada");
  });
});

describe("DELETE /api/chat/messages/:id", () => {
  test("só admin acessa a rota (403 do middleware)", async () => {
    mockAuthenticatedAccount(prisma, branchUser);
    const response = await request(app)
      .delete("/api/chat/messages/5")
      .set("x-access-token", token);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Access Denied" });
  });

  test("admin apaga mensagem no escopo", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ senderId: 99 }),
    );
    prisma.chatMessage.delete.mockResolvedValue(makeMessage());

    const response = await request(app)
      .delete("/api/chat/messages/5")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Mensagem deletada com sucesso",
    });
    expect(prisma.chatMessage.delete).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });

  test("admin não apaga mensagem de loja fora do escopo", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(
      makeMessage({ unitStoreId: 77 }),
    );

    const response = await request(app)
      .delete("/api/chat/messages/5")
      .set("x-access-token", token);

    expectChatError(response, 403, "Sem permissão para deletar esta mensagem");
    expect(prisma.chatMessage.delete).not.toHaveBeenCalled();
  });

  test("mensagem inexistente responde 404", async () => {
    prisma.chatMessage.findUnique.mockResolvedValue(null);
    const response = await request(app)
      .delete("/api/chat/messages/5")
      .set("x-access-token", token);
    expectChatError(response, 404, "Mensagem não encontrada");
  });
});

describe("GET /api/chat/statistics", () => {
  test("retorna os totais no escopo e 24 faixas por hora", async () => {
    MockDate.set(new Date("2026-11-06T15:00:00.000Z"));
    prisma.chatMessage.count.mockResolvedValue(2);
    prisma.chatMessage.findMany
      .mockResolvedValueOnce([
        { senderId: 1 },
        { senderId: 2 },
        { senderId: 3 },
      ])
      .mockResolvedValueOnce([{ unitStoreId: 10 }]);
    prisma.chatMessage.findFirst.mockResolvedValue({
      id: 9,
      text: "último",
      createdAt: "2026-11-06T14:00:00.000Z",
      sender: { name: "Ana" },
      unitStore: { name: "Matriz" },
    });

    const response = await request(app)
      .get("/api/chat/statistics")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    const { statistics } = response.body;
    expect(statistics).toEqual(
      expect.objectContaining({
        totalMessages: 2,
        messagesWithImages: 2,
        messagesWithText: 2,
        messagesToday: 2,
        uniqueSenders: 3,
        activeUnits: 1,
        lastMessage: {
          id: 9,
          text: "último",
          sender: "Ana",
          unit: "Matriz",
          createdAt: "2026-11-06T14:00:00.000Z",
        },
      }),
    );
    expect(statistics.messagesByHour).toHaveLength(24);
    expect(statistics.messagesByHour[0]).toEqual({ hour: 23, count: 2 });
    expect(statistics.messagesByHour[23]).toEqual({ hour: 0, count: 2 });
    expect(prisma.chatMessage.count).toHaveBeenNthCalledWith(1, {
      where: { unitStoreId: { in: [10, 11] } },
    });
  });

  test("sem mensagens retorna lastMessage null", async () => {
    prisma.chatMessage.count.mockResolvedValue(0);
    prisma.chatMessage.findMany.mockResolvedValue([]);
    prisma.chatMessage.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/chat/statistics")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.statistics.lastMessage).toBeNull();
  });

  test("erro no banco responde 500", async () => {
    prisma.chatMessage.count.mockRejectedValue(new Error("db down"));
    const response = await request(app)
      .get("/api/chat/statistics")
      .set("x-access-token", token);
    expectChatError(response, 500, "Falha ao carregar estatísticas");
  });
});
