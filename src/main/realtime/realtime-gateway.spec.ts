import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { setupRealtimeGateway } from "./realtime-gateway";
import { setRealtimeServer } from "./realtime-state";
import { getAccountScope } from "./store-scope";
import { prisma } from "../../infra/db/mysql/helpers";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";

const mockUse = jest.fn();
const mockOn = jest.fn();
const mockToEmit = jest.fn();
const mockTo = jest.fn().mockReturnValue({ emit: mockToEmit });

jest.mock("socket.io", () => ({
  Server: jest.fn().mockImplementation(() => ({
    use: mockUse,
    on: mockOn,
    to: mockTo,
  })),
}));

jest.mock("./realtime-state", () => ({
  setRealtimeServer: jest.fn(),
}));

jest.mock("./store-scope", () => ({
  getAccountScope: jest.fn(),
}));

jest.mock("../../infra/db/mysql/helpers", () => ({
  prisma: {
    account: { findUnique: jest.fn() },
    unitStore: { findMany: jest.fn() },
    chatMessage: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../infra/cryptography/jwt-adapter/jwt-adapter", () => ({
  JwtAdapter: jest.fn().mockImplementation(() => ({
    decode: jest.fn(),
  })),
}));

type Ack = (response: unknown) => void;

const jwtDecodeMock = (
  (JwtAdapter as unknown as jest.Mock).mock.results[0].value as {
    decode: jest.Mock;
  }
).decode;

const getAccountScopeMock = getAccountScope as jest.Mock;
const setRealtimeServerMock = setRealtimeServer as jest.Mock;
const prismaAccountFindUnique = prisma.account.findUnique as jest.Mock;
const prismaUnitStoreFindMany = prisma.unitStore.findMany as jest.Mock;
const prismaChatMessageFindMany = prisma.chatMessage.findMany as jest.Mock;
const prismaChatMessageCreate = prisma.chatMessage.create as jest.Mock;
const prismaChatMessageDelete = prisma.chatMessage.delete as jest.Mock;
const prismaChatMessageFindUnique = prisma.chatMessage
  .findUnique as jest.Mock;

const makeSocket = (overrides: Record<string, unknown> = {}) => {
  const handlers: Record<string, (...args: unknown[]) => unknown> = {};
  const socketToEmit = jest.fn();
  const socketTo = jest.fn().mockReturnValue({ emit: socketToEmit });

  return {
    id: "socket_1",
    handshake: {
      auth: {},
      headers: {},
      query: {},
    },
    data: {},
    join: jest.fn(),
    emit: jest.fn(),
    to: socketTo,
    __socketToEmit: socketToEmit,
    on: jest.fn((event: string, handler: (...args: unknown[]) => unknown) => {
      handlers[event] = handler;
    }),
    __handlers: handlers,
    ...overrides,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

const setup = () => {
  const httpServer = {} as HttpServer;
  setupRealtimeGateway(httpServer);

  const middleware = mockUse.mock.calls[0][0] as (
    socket: ReturnType<typeof makeSocket>,
    next: (err?: Error) => void,
  ) => Promise<void>;

  const connectionCall = mockOn.mock.calls.find(
    ([event]) => event === "connection",
  ) as [string, (socket: ReturnType<typeof makeSocket>) => Promise<void>];

  const connectionHandler = connectionCall[1];

  return { middleware, connectionHandler };
};

const defaultAccount: {
  id: number;
  name: string;
  email: string;
  role: "principal" | "branch";
  unitStoreId: number | null;
} = {
  id: 1,
  name: "Any Name",
  email: "any@mail.com",
  role: "branch",
  unitStoreId: 5,
};

const defaultScope: {
  accountId: number;
  role: "principal" | "branch";
  unitStoreId: number | null;
  rootStoreId: number | null;
  visibleUnitIds: number[];
} = {
  accountId: 1,
  role: "branch",
  unitStoreId: 5,
  rootStoreId: 2,
  visibleUnitIds: [5],
};

const makeSessionSocket = (
  overrides: {
    account?: Partial<typeof defaultAccount>;
    scope?: Partial<typeof defaultScope>;
    networkRoom?: string;
  } = {},
) => {
  const account = { ...defaultAccount, ...overrides.account };
  const scope = { ...defaultScope, ...overrides.scope };
  const networkRoom = overrides.networkRoom ?? "network:2";

  const socket = makeSocket({
    data: { session: { account, scope, networkRoom } },
  });

  return socket;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockTo.mockReturnValue({ emit: mockToEmit });
  prismaUnitStoreFindMany.mockResolvedValue([]);
  prismaChatMessageFindMany.mockResolvedValue([]);
});

describe("realtime-gateway", () => {
  describe("setupRealtimeGateway()", () => {
    test("Should register the realtime server via setRealtimeServer", () => {
      const httpServer = {} as HttpServer;
      setupRealtimeGateway(httpServer);

      expect(setRealtimeServerMock).toHaveBeenCalledTimes(1);
    });

    test("Should create the socket.io Server with the expected path and cors options", () => {
      const httpServer = {} as HttpServer;
      setupRealtimeGateway(httpServer);

      expect(Server).toHaveBeenCalledWith(
        httpServer,
        expect.objectContaining({
          path: "/socket.io",
          cors: expect.objectContaining({ origin: "*" }),
        }),
      );
    });
  });

  describe("auth middleware (io.use)", () => {
    test("Should call next with an error when no token is provided", async () => {
      const { middleware } = setup();
      const socket = makeSocket();
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(getAccountScopeMock).not.toHaveBeenCalled();
    });

    test("Should call next with an error when the token is not a string (e.g. header array)", async () => {
      const { middleware } = setup();
      const socket = makeSocket({
        handshake: {
          auth: {},
          headers: { "x-access-token": ["a", "b"] },
          query: {},
        },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("Should read the token from handshake.auth.token", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(defaultScope);
      prismaAccountFindUnique.mockResolvedValue(defaultAccount);

      const socket = makeSocket({
        handshake: { auth: { token: "auth_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(jwtDecodeMock).toHaveBeenCalledWith("auth_token");
      expect(next).toHaveBeenCalledWith();
    });

    test("Should fall back to the x-access-token header when auth.token is absent", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(defaultScope);
      prismaAccountFindUnique.mockResolvedValue(defaultAccount);

      const socket = makeSocket({
        handshake: {
          auth: {},
          headers: { "x-access-token": "header_token" },
          query: {},
        },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(jwtDecodeMock).toHaveBeenCalledWith("header_token");
      expect(next).toHaveBeenCalledWith();
    });

    test("Should fall back to handshake.query.token as a last resort", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(defaultScope);
      prismaAccountFindUnique.mockResolvedValue(defaultAccount);

      const socket = makeSocket({
        handshake: { auth: {}, headers: {}, query: { token: "query_token" } },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(jwtDecodeMock).toHaveBeenCalledWith("query_token");
      expect(next).toHaveBeenCalledWith();
    });

    test("Should call next with an error when the decoded payload has no id", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({});

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(getAccountScopeMock).not.toHaveBeenCalled();
    });

    test("Should call next with an error when getAccountScope returns null", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(null);

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(prismaAccountFindUnique).not.toHaveBeenCalled();
    });

    test("Should call next with an error when the account record cannot be found", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(defaultScope);
      prismaAccountFindUnique.mockResolvedValue(null);

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("Should call next with an error when decode throws", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockRejectedValue(new Error("boom"));

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("Should set socket.data.session with networkRoom based on scope.rootStoreId", async () => {
      const { middleware } = setup();
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(defaultScope);
      prismaAccountFindUnique.mockResolvedValue(defaultAccount);

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(socket.data.session).toEqual({
        account: defaultAccount,
        scope: defaultScope,
        networkRoom: "network:2",
      });
      expect(next).toHaveBeenCalledWith();
    });

    test("Should use the network:global room when scope.rootStoreId is null", async () => {
      const { middleware } = setup();
      const scopeWithoutRoot = { ...defaultScope, rootStoreId: null };
      jwtDecodeMock.mockResolvedValue({ id: "1" });
      getAccountScopeMock.mockResolvedValue(scopeWithoutRoot);
      prismaAccountFindUnique.mockResolvedValue(defaultAccount);

      const socket = makeSocket({
        handshake: { auth: { token: "any_token" }, headers: {}, query: {} },
      });
      const next = jest.fn();

      await middleware(socket, next);

      expect(socket.data.session.networkRoom).toBe("network:global");
    });
  });

  describe("connection handler (io.on('connection'))", () => {
    test("Should join the network room and every visible unit room", async () => {
      const { connectionHandler } = setup();
      const socket = makeSessionSocket({
        scope: { visibleUnitIds: [5, 6] },
      });

      await connectionHandler(socket);

      expect(socket.join).toHaveBeenCalledWith("network:2");
      expect(socket.join).toHaveBeenCalledWith("unit:5");
      expect(socket.join).toHaveBeenCalledWith("unit:6");
    });

    test("Should not query units when visibleUnitIds is empty and emit an empty units list", async () => {
      const { connectionHandler } = setup();
      const socket = makeSessionSocket({ scope: { visibleUnitIds: [] } });

      await connectionHandler(socket);

      expect(prismaUnitStoreFindMany).not.toHaveBeenCalled();
      expect(socket.emit).toHaveBeenCalledWith(
        "session:ready",
        expect.objectContaining({ units: [] }),
      );
    });

    test("Should query visible units and emit session:ready with account and units", async () => {
      const { connectionHandler } = setup();
      const units = [{ id: 5, name: "Unit 5", parentStoreId: 2, isMain: false }];
      prismaUnitStoreFindMany.mockResolvedValue(units);

      const socket = makeSessionSocket({ scope: { visibleUnitIds: [5] } });

      await connectionHandler(socket);

      expect(prismaUnitStoreFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { in: [5] } },
        }),
      );
      expect(socket.emit).toHaveBeenCalledWith("session:ready", {
        account: socket.data.session.account,
        units,
      });
    });

    test("Should emit chat:history with the fetched messages reversed", async () => {
      const { connectionHandler } = setup();
      const messages = [{ id: 2 }, { id: 1 }];
      prismaChatMessageFindMany.mockResolvedValue(messages);

      const socket = makeSessionSocket();

      await connectionHandler(socket);

      expect(socket.emit).toHaveBeenCalledWith("chat:history", [
        { id: 1 },
        { id: 2 },
      ]);
    });

    test("Should register the chat and disconnect event handlers", async () => {
      const { connectionHandler } = setup();
      const socket = makeSessionSocket();

      await connectionHandler(socket);

      const registeredEvents = socket.on.mock.calls.map(
        ([event]: [string]) => event,
      );
      expect(registeredEvents).toEqual(
        expect.arrayContaining([
          "chat:fetch-history",
          "chat:send",
          "chat:delete-message",
          "chat:typing",
          "disconnect",
        ]),
      );
    });
  });

  describe("chat:fetch-history handler", () => {
    const getHandler = async (socket: ReturnType<typeof makeSessionSocket>) => {
      const { connectionHandler } = setup();
      await connectionHandler(socket);
      return socket.__handlers["chat:fetch-history"] as (
        ack?: Ack,
      ) => Promise<void>;
    };

    test("Should emit chat:history and ack ok:true on success", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      const messages = [{ id: 2 }, { id: 1 }];
      prismaChatMessageFindMany.mockResolvedValue(messages);
      const ack = jest.fn();

      await handler(ack);

      expect(socket.emit).toHaveBeenCalledWith("chat:history", [
        { id: 1 },
        { id: 2 },
      ]);
      expect(ack).toHaveBeenCalledWith({ ok: true });
    });

    test("Should ack ok:false when the query fails", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      prismaChatMessageFindMany.mockRejectedValue(new Error("db error"));
      const ack = jest.fn();

      await handler(ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Falha ao buscar histórico",
      });
    });
  });

  describe("chat:send handler", () => {
    const getHandler = async (
      socket: ReturnType<typeof makeSessionSocket>,
    ) => {
      const { connectionHandler } = setup();
      await connectionHandler(socket);
      return socket.__handlers["chat:send"] as (
        payload: Record<string, unknown>,
        ack?: Ack,
      ) => Promise<void>;
    };

    test("Should ack an error when the message has neither text nor image", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      const ack = jest.fn();

      await handler({ text: "   " }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Mensagem vazia",
      });
      expect(prismaChatMessageCreate).not.toHaveBeenCalled();
    });

    test("Should ack an error when the image exceeds 5MB", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      const ack = jest.fn();
      const hugeImage = "A".repeat(7_000_000);

      await handler({ imageBase64: hugeImage }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Imagem excede 5MB",
      });
      expect(prismaChatMessageCreate).not.toHaveBeenCalled();
    });

    test("Should ack an error when there is no unit store to send to", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: null },
        scope: { visibleUnitIds: [] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();

      await handler({ text: "hello" }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Conta sem loja vinculada",
      });
    });

    test("Should ack an error when the chosen unit is not visible to the account", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: 5 },
        scope: { visibleUnitIds: [7] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();

      await handler({ text: "hello" }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Sem permissao para enviar para essa loja",
      });
    });

    test("Should create the message, broadcast chat:message and ack ok:true with the message id", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: 5 },
        scope: { visibleUnitIds: [5] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();
      const createdMessage = { id: 99, text: "hello" };
      prismaChatMessageCreate.mockResolvedValue(createdMessage);

      await handler({ text: "hello" }, ack);

      expect(prismaChatMessageCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            unitStoreId: 5,
            senderId: socket.data.session.account.id,
            text: "hello",
          }),
        }),
      );
      expect(mockTo).toHaveBeenCalledWith("network:2");
      expect(mockToEmit).toHaveBeenCalledWith("chat:message", createdMessage);
      expect(ack).toHaveBeenCalledWith({ ok: true, messageId: 99 });
    });

    test("Should strip the data: prefix from a base64 image before persisting it", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: 5 },
        scope: { visibleUnitIds: [5] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();
      prismaChatMessageCreate.mockResolvedValue({ id: 1 });

      await handler(
        {
          imageBase64: "data:image/png;base64,abc123",
          imageMimeType: "image/png",
        },
        ack,
      );

      expect(prismaChatMessageCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            imageBase64: "abc123",
            imageMimeType: "image/png",
          }),
        }),
      );
    });

    test("Should use the requested unitStoreId when it is within the visible units", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: 5 },
        scope: { visibleUnitIds: [5, 6] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();
      prismaChatMessageCreate.mockResolvedValue({ id: 1 });

      await handler({ text: "hi", unitStoreId: 6 }, ack);

      expect(prismaChatMessageCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ unitStoreId: 6 }),
        }),
      );
    });

    test("Should ack ok:false when persisting the message fails", async () => {
      const socket = makeSessionSocket({
        account: { unitStoreId: 5 },
        scope: { visibleUnitIds: [5] },
      });
      const handler = await getHandler(socket);
      const ack = jest.fn();
      prismaChatMessageCreate.mockRejectedValue(new Error("db error"));

      await handler({ text: "hello" }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Falha ao enviar mensagem",
      });
    });
  });

  describe("chat:delete-message handler", () => {
    const getHandler = async (
      socket: ReturnType<typeof makeSessionSocket>,
    ) => {
      const { connectionHandler } = setup();
      await connectionHandler(socket);
      return socket.__handlers["chat:delete-message"] as (
        payload: { messageId?: number },
        ack?: Ack,
      ) => Promise<void>;
    };

    test("Should ack an error when messageId is missing", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      const ack = jest.fn();

      await handler({}, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "ID de mensagem inválido",
      });
    });

    test("Should ack an error when the message cannot be found", async () => {
      const socket = makeSessionSocket();
      const handler = await getHandler(socket);
      prismaChatMessageFindUnique.mockResolvedValue(null);
      const ack = jest.fn();

      await handler({ messageId: 1 }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Mensagem não encontrada",
      });
    });

    test("Should ack an error when a non-owner, non-principal account tries to delete it", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, role: "branch" },
      });
      const handler = await getHandler(socket);
      prismaChatMessageFindUnique.mockResolvedValue({
        id: 1,
        senderId: 999,
      });
      const ack = jest.fn();

      await handler({ messageId: 1 }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Sem permissão para deletar",
      });
      expect(prismaChatMessageDelete).not.toHaveBeenCalled();
    });

    test("Should allow the sender to delete their own message", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, role: "branch" },
      });
      const handler = await getHandler(socket);
      prismaChatMessageFindUnique.mockResolvedValue({ id: 1, senderId: 1 });
      const ack = jest.fn();

      await handler({ messageId: 1 }, ack);

      expect(prismaChatMessageDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockToEmit).toHaveBeenCalledWith("chat:message-deleted", {
        messageId: 1,
      });
      expect(ack).toHaveBeenCalledWith({ ok: true });
    });

    test("Should allow a principal account to delete someone else's message", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, role: "principal" },
      });
      const handler = await getHandler(socket);
      prismaChatMessageFindUnique.mockResolvedValue({
        id: 1,
        senderId: 999,
      });
      const ack = jest.fn();

      await handler({ messageId: 1 }, ack);

      expect(prismaChatMessageDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(ack).toHaveBeenCalledWith({ ok: true });
    });

    test("Should ack ok:false when deleting the message fails", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, role: "principal" },
      });
      const handler = await getHandler(socket);
      prismaChatMessageFindUnique.mockResolvedValue({ id: 1, senderId: 1 });
      prismaChatMessageDelete.mockRejectedValue(new Error("db error"));
      const ack = jest.fn();

      await handler({ messageId: 1 }, ack);

      expect(ack).toHaveBeenCalledWith({
        ok: false,
        error: "Falha ao deletar mensagem",
      });
    });
  });

  describe("chat:typing handler", () => {
    test("Should broadcast chat:typing with the account info to the network room", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, name: "Joabe" },
      });
      const { connectionHandler } = setup();
      await connectionHandler(socket);

      const handler = socket.__handlers["chat:typing"] as (payload: {
        isTyping: boolean;
      }) => void;

      handler({ isTyping: true });

      expect(socket.to).toHaveBeenCalledWith("network:2");
      expect(socket.__socketToEmit).toHaveBeenCalledWith("chat:typing", {
        accountId: 1,
        name: "Joabe",
        isTyping: true,
      });
    });

    test("Should coerce a falsy/missing isTyping value to false", async () => {
      const socket = makeSessionSocket();
      const { connectionHandler } = setup();
      await connectionHandler(socket);

      const handler = socket.__handlers["chat:typing"] as (payload?: {
        isTyping?: boolean;
      }) => void;

      handler(undefined);

      expect(socket.__socketToEmit).toHaveBeenCalledWith(
        "chat:typing",
        expect.objectContaining({ isTyping: false }),
      );
    });
  });

  describe("disconnect handler", () => {
    test("Should broadcast chat:typing with isTyping false to the network room", async () => {
      const socket = makeSessionSocket({
        account: { id: 1, name: "Joabe" },
      });
      const { connectionHandler } = setup();
      await connectionHandler(socket);

      const handler = socket.__handlers["disconnect"] as () => void;

      handler();

      expect(socket.to).toHaveBeenCalledWith("network:2");
      expect(socket.__socketToEmit).toHaveBeenCalledWith("chat:typing", {
        accountId: 1,
        name: "Joabe",
        isTyping: false,
      });
    });
  });
});
