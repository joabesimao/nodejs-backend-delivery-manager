import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../../../config/Env";
import { prisma } from "../../infra/db/mysql/helpers";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { setRealtimeServer } from "./realtime-state";
import { getAccountScope } from "./store-scope";

const jwtAdapter = new JwtAdapter(env.JWT_SECRET);

type ChatSendPayload = {
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  unitStoreId?: number;
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const estimateBase64Bytes = (base64Value: string): number => {
  const padding = base64Value.match(/=+$/)?.[0].length ?? 0;
  return Math.floor((base64Value.length * 3) / 4) - padding;
};

const normalizeBase64 = (imageBase64: string): string => {
  if (!imageBase64) {
    return "";
  }

  const marker = ",";
  const markerIndex = imageBase64.indexOf(marker);

  if (markerIndex >= 0 && imageBase64.startsWith("data:")) {
    return imageBase64.slice(markerIndex + 1);
  }

  return imageBase64;
};

export const setupRealtimeGateway = (httpServer: HttpServer): void => {
  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setRealtimeServer(io);

  io.use(async (socket, next) => {
    try {
      const authToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers["x-access-token"] ||
        socket.handshake.query?.token;

      if (!authToken || typeof authToken !== "string") {
        next(new Error("Token ausente"));
        return;
      }

      const payload = await jwtAdapter.decode(authToken);
      const accountId = Number(payload?.id || 0);

      if (!accountId) {
        next(new Error("Token invalido"));
        return;
      }

      const scope = await getAccountScope(prisma, accountId);

      if (!scope) {
        next(new Error("Conta nao encontrada"));
        return;
      }

      const account = await prisma.account.findUnique({
        where: { id: accountId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          unitStoreId: true,
        },
      });

      if (!account) {
        next(new Error("Conta nao encontrada"));
        return;
      }

      const networkRoom = scope.rootStoreId
        ? `network:${scope.rootStoreId}`
        : "network:global";

      socket.data.session = {
        account,
        scope,
        networkRoom,
      };

      next();
    } catch {
      next(new Error("Falha ao autenticar socket"));
    }
  });

  io.on("connection", async (socket) => {
    const session = socket.data.session as {
      account: {
        id: number;
        name: string;
        email: string;
        role: "principal" | "branch";
        unitStoreId: number | null;
      };
      scope: {
        visibleUnitIds: number[];
        rootStoreId: number | null;
      };
      networkRoom: string;
    };

    socket.join(session.networkRoom);

    const unitRooms = session.scope.visibleUnitIds.map(
      (unitId) => `unit:${unitId}`,
    );
    for (const room of unitRooms) {
      socket.join(room);
    }

    const units = session.scope.visibleUnitIds.length
      ? await prisma.unitStore.findMany({
          where: { id: { in: session.scope.visibleUnitIds } },
          select: { id: true, name: true, parentStoreId: true, isMain: true },
          orderBy: { id: "asc" },
        })
      : [];

    const messages = await prisma.chatMessage.findMany({
      where: session.scope.visibleUnitIds.length
        ? { unitStoreId: { in: session.scope.visibleUnitIds } }
        : undefined,
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
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    socket.emit("session:ready", {
      account: session.account,
      units,
    });

    socket.emit("chat:history", messages.reverse());

    // Fetch chat history
    socket.on("chat:fetch-history", async (ack?: (response: unknown) => void) => {
      try {
        const messages = await prisma.chatMessage.findMany({
          where: session.scope.visibleUnitIds.length
            ? { unitStoreId: { in: session.scope.visibleUnitIds } }
            : undefined,
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
          orderBy: { createdAt: "desc" },
          take: 100,
        });

        socket.emit("chat:history", messages.reverse());
        ack?.({ ok: true });
      } catch {
        ack?.({ ok: false, error: "Falha ao buscar histórico" });
      }
    });

    // Send chat message
    socket.on(
      "chat:send",
      async (payload: ChatSendPayload, ack?: (response: unknown) => void) => {
        try {
          const text =
            typeof payload?.text === "string" ? payload.text.trim() : "";
          const rawImage =
            typeof payload?.imageBase64 === "string"
              ? payload.imageBase64.trim()
              : "";
          const normalizedImage = normalizeBase64(rawImage);
          const imageMimeType =
            typeof payload?.imageMimeType === "string" &&
            payload.imageMimeType.trim()
              ? payload.imageMimeType.trim()
              : undefined;

          if (!text && !normalizedImage) {
            ack?.({ ok: false, error: "Mensagem vazia" });
            return;
          }

          if (normalizedImage) {
            const estimatedBytes = estimateBase64Bytes(normalizedImage);
            if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
              ack?.({ ok: false, error: "Imagem excede 5MB" });
              return;
            }
          }

          const requestedUnit = Number(payload?.unitStoreId || 0) || null;
          const fallbackUnit = session.account.unitStoreId;
          const chosenUnitId = requestedUnit ?? fallbackUnit;

          if (!chosenUnitId) {
            ack?.({ ok: false, error: "Conta sem loja vinculada" });
            return;
          }

          if (!session.scope.visibleUnitIds.includes(chosenUnitId)) {
            ack?.({
              ok: false,
              error: "Sem permissao para enviar para essa loja",
            });
            return;
          }

          const message = await prisma.chatMessage.create({
            data: {
              unitStoreId: chosenUnitId,
              senderId: session.account.id,
              text: text || null,
              imageBase64: normalizedImage || null,
              imageMimeType: imageMimeType || null,
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

          io.to(session.networkRoom).emit("chat:message", message);
          ack?.({ ok: true, messageId: message.id });
        } catch {
          ack?.({ ok: false, error: "Falha ao enviar mensagem" });
        }
      },
    );

    // Delete chat message
    socket.on(
      "chat:delete-message",
      async (payload: { messageId: number }, ack?: (response: unknown) => void) => {
        try {
          const messageId = Number(payload?.messageId || 0);

          if (!messageId) {
            ack?.({ ok: false, error: "ID de mensagem inválido" });
            return;
          }

          const message = await prisma.chatMessage.findUnique({
            where: { id: messageId },
          });

          if (!message) {
            ack?.({ ok: false, error: "Mensagem não encontrada" });
            return;
          }

          // Only sender or principal can delete
          if (
            message.senderId !== session.account.id &&
            session.account.role !== "principal"
          ) {
            ack?.({ ok: false, error: "Sem permissão para deletar" });
            return;
          }

          await prisma.chatMessage.delete({
            where: { id: messageId },
          });

          io.to(session.networkRoom).emit("chat:message-deleted", { messageId });
          ack?.({ ok: true });
        } catch {
          ack?.({ ok: false, error: "Falha ao deletar mensagem" });
        }
      },
    );
  });
};
