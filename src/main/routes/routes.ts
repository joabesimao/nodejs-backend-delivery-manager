import { Request, Router } from "express";
import { makeAddRegisterController } from "../factories/add-register";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";
import { makeLoadRegisterByNameController } from "../factories/load-by-name-register";
import { makeSignupController } from "../factories/signup";
import { makeLoginController } from "../factories/login-factory";
import { makeAddOrderDeliveryController } from "../factories/add-order-delivery";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/auth-middleware-factory";
import { makeLoadOrdersDeliveryController } from "../factories/load-order-delivery";
import { makeDeleteOrderDeliveryController } from "../factories/delete-order-delivery";
import { makeLoadOrderByIdController } from "../factories/load-order-delivery-by-id";
import { makeDeleteAccountController } from "../factories/delete-account";
import { makeLoadClientController } from "../factories/load-client-mysql";
import { makeLoadOneClientController } from "../factories/load-one-client-mysql";
import { makeLoadAddressController } from "../factories/load-address";
import { makeUpdateOrderDeliveryController } from "../factories/update-order-delivery";
import { makeUpdateAddressController } from "../factories/update-address";
import { makeDeleteAddressController } from "../factories/delete-address";
import { makeDeleteClientController } from "../factories/delete-client-mysql";
import { makeUpdateClientController } from "../factories/update-client";
import { makeLoadCityController } from "../factories/load-city";
import { makeLoadNeighborhoodController } from "../factories/load-neighborhood";
import { makeAddCityController } from "../factories/add-city";
import { makeAddNeighborhoodController } from "../factories/add-neighborhood";
import { makeRefreshTokenController } from "../factories/refresh-token-factory";
import { makeLoadOrderDeliveryRankingController } from "../factories/load-order-delivery-ranking";
import { makeAddDeliverymanController } from "../factories/add-deliveryman";
import { makeLoadDeliverymanController } from "../factories/load-deliveryman";
import { prisma } from "../../infra/db/mysql/helpers";
import { getAccountScope } from "../realtime/store-scope";

const MAX_CHAT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

const resolveVisibleUnitsForChat = async (accountId: number) => {
  const scope = await getAccountScope(prisma, accountId);

  if (!scope) {
    return {
      scope: null,
      visibleUnitIds: [] as number[],
    };
  }

  let visibleUnitIds = scope.visibleUnitIds;
  if (visibleUnitIds.length === 0) {
    const fallbackUnit = scope.unitStoreId
      ? { id: scope.unitStoreId }
      : ((await prisma.unitStore.findFirst({
          where: { isMain: true },
          select: { id: true },
          orderBy: { id: "asc" },
        })) ??
        (await prisma.unitStore.findFirst({
          select: { id: true },
          orderBy: { id: "asc" },
        })));

    if (fallbackUnit?.id) {
      visibleUnitIds = [fallbackUnit.id];
    }
  }

  return {
    scope,
    visibleUnitIds,
  };
};

export default (router: Router): void => {
  const auth = adaptMiddleware(makeAuthMiddleware());
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/client", adaptRoute(makeLoadClientController()));
  router.get(
    "/orderDelivery",
    auth,
    adaptRoute(makeLoadOrdersDeliveryController()),
  );
  router.get(
    "/orderDelivery/ranking/deliveryman",
    auth,
    adaptRoute(makeLoadOrderDeliveryRankingController()),
  );
  router.get("/address", adaptRoute(makeLoadAddressController()));
  router.get("/register/:id", adaptRoute(makeLoadRegisterByIdController()));
  router.get(
    "/register/name/:name",

    adaptRoute(makeLoadRegisterByNameController()),
  );
  router.get(
    "/orderDelivery/:id",
    auth,
    adaptRoute(makeLoadOrderByIdController()),
  );
  router.get("/client/:id", adaptRoute(makeLoadOneClientController()));
  router.get("/city", adaptRoute(makeLoadCityController()));
  router.get("/neighborhood", adaptRoute(makeLoadNeighborhoodController()));
  router.get("/deliveryman", adaptRoute(makeLoadDeliverymanController()));
  router.post("/city", adaptRoute(makeAddCityController()));
  router.post("/neighborhood", adaptRoute(makeAddNeighborhoodController()));
  router.post("/deliveryman", adaptRoute(makeAddDeliverymanController()));
  router.post("/register", adaptRoute(makeAddRegisterController()));
  router.post("/signup", adaptRoute(makeSignupController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.post("/refresh-token", adaptRoute(makeRefreshTokenController()));
  router.post(
    "/orderDelivery",
    auth,
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.post(
    "/orderDelivery/:id",
    auth,
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.put("/client/:id", adaptRoute(makeUpdateClientController()));
  router.put("/address/:id", adaptRoute(makeUpdateAddressController()));
  router.put(
    "/orderDelivery/:id",
    auth,
    adaptRoute(makeUpdateOrderDeliveryController()),
  );
  router.delete(
    "/register/:id",

    adaptRoute(makeDeleteRegisterByIdController()),
  );
  router.delete(
    "/orderDelivery/:id",
    auth,
    adaptRoute(makeDeleteOrderDeliveryController()),
  );

  router.get("/chat/messages", auth, async (req, res) => {
    try {
      const accountId = Number(
        (req as Request & { accountId?: number }).accountId || 0,
      );

      if (!accountId) {
        res.status(401).json({ error: "Nao autenticado" });
        return;
      }

      const { scope, visibleUnitIds } =
        await resolveVisibleUnitsForChat(accountId);

      if (!scope) {
        res.status(404).json({ error: "Conta nao encontrada" });
        return;
      }

      const messages = await prisma.chatMessage.findMany({
        where: visibleUnitIds.length
          ? { unitStoreId: { in: visibleUnitIds } }
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

      res.status(200).json(messages.reverse());
    } catch {
      res.status(500).json({ error: "Falha ao carregar mensagens" });
    }
  });

  router.post("/chat/messages", auth, async (req, res) => {
    try {
      const accountId = Number(
        (req as Request & { accountId?: number }).accountId || 0,
      );

      if (!accountId) {
        res.status(401).json({ error: "Nao autenticado" });
        return;
      }

      const { scope, visibleUnitIds } =
        await resolveVisibleUnitsForChat(accountId);

      if (!scope) {
        res.status(404).json({ error: "Conta nao encontrada" });
        return;
      }

      const text =
        typeof req.body?.text === "string" ? req.body.text.trim() : "";
      const rawImage =
        typeof req.body?.imageBase64 === "string"
          ? req.body.imageBase64.trim()
          : "";
      const normalizedImage = normalizeBase64(rawImage);
      const imageMimeType =
        typeof req.body?.imageMimeType === "string" &&
        req.body.imageMimeType.trim()
          ? req.body.imageMimeType.trim()
          : null;

      if (!text && !normalizedImage) {
        res.status(400).json({ error: "Mensagem vazia" });
        return;
      }

      if (normalizedImage) {
        const estimatedBytes = estimateBase64Bytes(normalizedImage);
        if (estimatedBytes > MAX_CHAT_IMAGE_SIZE_BYTES) {
          res.status(400).json({ error: "Imagem excede 5MB" });
          return;
        }
      }

      const requestedUnitId = Number(req.body?.unitStoreId || 0) || null;
      const chosenUnitId =
        requestedUnitId ?? scope.unitStoreId ?? visibleUnitIds[0] ?? null;

      if (!chosenUnitId) {
        res.status(400).json({ error: "Conta sem loja vinculada" });
        return;
      }

      if (visibleUnitIds.length > 0 && !visibleUnitIds.includes(chosenUnitId)) {
        res
          .status(403)
          .json({ error: "Sem permissao para enviar para essa loja" });
        return;
      }

      const message = await prisma.chatMessage.create({
        data: {
          unitStoreId: chosenUnitId,
          senderId: accountId,
          text: text || null,
          imageBase64: normalizedImage || null,
          imageMimeType,
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

      res.status(201).json(message);
    } catch {
      res.status(500).json({ error: "Falha ao enviar mensagem" });
    }
  });

  router.put("/chat/messages/:id", auth, async (req, res) => {
    try {
      const accountId = Number(
        (req as Request & { accountId?: number }).accountId || 0,
      );
      const messageId = Number(req.params.id || 0);

      if (!accountId) {
        res.status(401).json({ error: "Nao autenticado" });
        return;
      }

      if (!messageId) {
        res.status(400).json({ error: "Mensagem invalida" });
        return;
      }

      const text =
        typeof req.body?.text === "string" ? req.body.text.trim() : "";
      if (!text) {
        res.status(400).json({ error: "Texto da mensagem obrigatorio" });
        return;
      }

      const existing = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        select: {
          id: true,
          senderId: true,
        },
      });

      if (!existing) {
        res.status(404).json({ error: "Mensagem nao encontrada" });
        return;
      }

      if (existing.senderId !== accountId) {
        res
          .status(403)
          .json({ error: "Sem permissao para editar essa mensagem" });
        return;
      }

      const updated = await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          text,
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

      res.status(200).json(updated);
    } catch {
      res.status(500).json({ error: "Falha ao atualizar mensagem" });
    }
  });

  router.delete("/chat/messages/:id", auth, async (req, res) => {
    try {
      const accountId = Number(
        (req as Request & { accountId?: number }).accountId || 0,
      );
      const messageId = Number(req.params.id || 0);

      if (!accountId) {
        res.status(401).json({ error: "Nao autenticado" });
        return;
      }

      if (!messageId) {
        res.status(400).json({ error: "Mensagem invalida" });
        return;
      }

      const existing = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        select: {
          id: true,
          senderId: true,
        },
      });

      if (!existing) {
        res.status(404).json({ error: "Mensagem nao encontrada" });
        return;
      }

      if (existing.senderId !== accountId) {
        res
          .status(403)
          .json({ error: "Sem permissao para excluir essa mensagem" });
        return;
      }

      await prisma.chatMessage.delete({
        where: { id: messageId },
      });

      res.status(200).json({ ok: true });
    } catch {
      res.status(500).json({ error: "Falha ao excluir mensagem" });
    }
  });

  router.delete(
    "/account/:id",

    adaptRoute(makeDeleteAccountController()),
  );

  router.delete(
    "/address/:id",

    adaptRoute(makeDeleteAddressController()),
  );

  router.delete(
    "/client/:id",

    adaptRoute(makeDeleteClientController()),
  );
};
