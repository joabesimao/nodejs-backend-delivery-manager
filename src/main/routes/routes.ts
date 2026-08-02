import { OrderStatus } from "@prisma/client";
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
  router.get("/dashboard/overview", auth, async (req, res) => {
    try {
      const accountId = Number(
        (req as Request & { accountId?: number }).accountId || 0,
      );

      if (!accountId) {
        res.status(401).json({ error: "Nao autenticado" });
        return;
      }

      const scope = await getAccountScope(prisma, accountId);

      if (!scope) {
        res.status(404).json({ error: "Conta nao encontrada" });
        return;
      }

      const ordersWhere = scope.visibleUnitIds.length
        ? {
            unitStoreId: {
              in: scope.visibleUnitIds,
            },
          }
        : undefined;

      const [
        clientsCount,
        deliverymenCount,
        citiesCount,
        neighborhoodsCount,
        activeDeliveriesCount,
        deliveredRevenue,
        latestOrders,
      ] = await Promise.all([
        prisma.client.count(),
        prisma.deliveryman.count(),
        prisma.city.count(),
        prisma.neighborhood.count(),
        prisma.orderDelivery.count({
          where: {
            ...ordersWhere,
            status: {
              in: [OrderStatus.actived, OrderStatus.delivered],
            },
          },
        }),
        prisma.orderDelivery.aggregate({
          where: {
            ...ordersWhere,
            status: OrderStatus.finished,
          },
          _sum: {
            amount: true,
          },
        }),
        prisma.orderDelivery.findMany({
          where: ordersWhere,
          include: {
            Register: {
              include: {
                client: true,
              },
            },
            deliveryman: true,
          },
          orderBy: {
            data: "desc",
          },
          take: 5,
        }),
      ]);

      res.status(200).json({
        metrics: {
          clients: clientsCount,
          deliverymen: deliverymenCount,
          activeDeliveries: activeDeliveriesCount,
          deliveredRevenue: deliveredRevenue._sum.amount ?? 0,
          cities: citiesCount,
          neighborhoods: neighborhoodsCount,
        },
        latestDeliveries: latestOrders.map((order) => ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          clientName:
            `${order.Register.client.name} ${order.Register.client.lastName}`.trim(),
          deliverymanName: order.deliveryman
            ? `${order.deliveryman.name} ${order.deliveryman.lastName}`.trim()
            : "Sem entregador",
        })),
      });
    } catch {
      res.status(500).json({ error: "Falha ao carregar dados do dashboard" });
    }
  });
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

      const scope = await getAccountScope(prisma, accountId);

      if (!scope) {
        res.status(404).json({ error: "Conta nao encontrada" });
        return;
      }

      const messages = await prisma.chatMessage.findMany({
        where: scope.visibleUnitIds.length
          ? { unitStoreId: { in: scope.visibleUnitIds } }
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
