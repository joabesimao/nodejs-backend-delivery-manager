import type { Server as SocketIOServer } from "socket.io";

type RealtimeStateModule = typeof import("./realtime-state");

const loadFreshModule = (): RealtimeStateModule => {
  let mod!: RealtimeStateModule;
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mod = require("./realtime-state");
  });
  return mod;
};

const makeFakeServer = () => {
  const emit = jest.fn();
  const to = jest.fn().mockReturnValue({ emit });
  const server = { to } as unknown as SocketIOServer;
  return { server, to, emit };
};

describe("realtime-state", () => {
  describe("emitDeliveryRealtime()", () => {
    test("Should do nothing and not throw when no realtime server has been set", () => {
      const { emitDeliveryRealtime } = loadFreshModule();

      expect(() =>
        emitDeliveryRealtime({
          eventType: "created",
          unitStoreId: 1,
          rootStoreId: null,
          order: { id: 1 },
        }),
      ).not.toThrow();
    });

    test("Should emit to the network:<rootStoreId> room when rootStoreId is provided", () => {
      const { setRealtimeServer, emitDeliveryRealtime } = loadFreshModule();
      const { server, to, emit } = makeFakeServer();

      setRealtimeServer(server);

      emitDeliveryRealtime({
        eventType: "updated",
        unitStoreId: 5,
        rootStoreId: 10,
        order: { id: 42 },
      });

      expect(to).toHaveBeenCalledWith("network:10");
      expect(emit).toHaveBeenCalledWith(
        "delivery:changed",
        expect.objectContaining({
          eventType: "updated",
          unitStoreId: 5,
          order: { id: 42 },
        }),
      );
    });

    test("Should emit to the network:global room when rootStoreId is null", () => {
      const { setRealtimeServer, emitDeliveryRealtime } = loadFreshModule();
      const { server, to } = makeFakeServer();

      setRealtimeServer(server);

      emitDeliveryRealtime({
        eventType: "deleted",
        unitStoreId: null,
        rootStoreId: null,
        order: null,
      });

      expect(to).toHaveBeenCalledWith("network:global");
    });

    test("Should include an ISO occurredAt timestamp in the emitted payload", () => {
      const { setRealtimeServer, emitDeliveryRealtime } = loadFreshModule();
      const { server, emit } = makeFakeServer();

      setRealtimeServer(server);

      emitDeliveryRealtime({
        eventType: "created",
        unitStoreId: 1,
        rootStoreId: 1,
        order: {},
      });

      const [, payload] = emit.mock.calls[0];
      expect(payload.occurredAt).toEqual(expect.any(String));
      expect(new Date(payload.occurredAt).toISOString()).toBe(
        payload.occurredAt,
      );
    });
  });
});
