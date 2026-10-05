import type { Server as SocketIOServer } from "socket.io";

interface DeliveryRealtimePayload {
  eventType: "created" | "updated" | "deleted";
  unitStoreId: number | null;
  rootStoreId: number | null;
  order: unknown;
}

let io: SocketIOServer | null = null;

export const setRealtimeServer = (server: SocketIOServer): void => {
  io = server;
};

export const networkRoomFor = (rootStoreId: number | null): string =>
  rootStoreId ? `network:${rootStoreId}` : "network:global";

export const emitDeliveryRealtime = (
  payload: DeliveryRealtimePayload,
): void => {
  if (!io) {
    return;
  }

  io.to(networkRoomFor(payload.rootStoreId)).emit("delivery:changed", {
    eventType: payload.eventType,
    unitStoreId: payload.unitStoreId,
    order: payload.order,
    occurredAt: new Date().toISOString(),
  });
};

// Mesmos eventos que o gateway emite, para mensagens criadas/apagadas via REST.
export const emitChatRealtime = (
  event: "chat:message" | "chat:message-deleted",
  rootStoreId: number | null,
  payload: unknown,
): void => {
  if (!io) {
    return;
  }

  io.to(networkRoomFor(rootStoreId)).emit(event, payload);
};

export const accountRoomFor = (accountId: number): string =>
  `account:${accountId}`;

export const emitToAccount = (
  accountId: number,
  event: string,
  payload: unknown,
): void => {
  if (!io) {
    return;
  }

  io.to(accountRoomFor(accountId)).emit(event, payload);
};
