import type { Server as SocketIOServer } from "socket.io";

type DeliveryRealtimePayload = {
  eventType: "created" | "updated" | "deleted";
  unitStoreId: number | null;
  rootStoreId: number | null;
  order: unknown;
};

let io: SocketIOServer | null = null;

export const setRealtimeServer = (server: SocketIOServer): void => {
  io = server;
};

export const emitDeliveryRealtime = (
  payload: DeliveryRealtimePayload,
): void => {
  if (!io) {
    return;
  }

  const room = payload.rootStoreId
    ? `network:${payload.rootStoreId}`
    : "network:global";

  io.to(room).emit("delivery:changed", {
    eventType: payload.eventType,
    unitStoreId: payload.unitStoreId,
    order: payload.order,
    occurredAt: new Date().toISOString(),
  });
};
