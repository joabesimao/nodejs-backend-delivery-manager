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
import { makeLoadChatMessagesController } from "../factories/load-chat-messages";
import { makeLoadChatMessageByIdController } from "../factories/load-chat-message-by-id";
import { makeAddChatMessageController } from "../factories/add-chat-message";
import { makeDeleteChatMessageController } from "../factories/delete-chat-message";
import { makeUpdateChatMessageController } from "../factories/update-chat-message";
import { makeSearchChatMessagesController } from "../factories/search-chat-messages";
import { makeGetChatStatisticsController } from "../factories/get-chat-statistics";

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

  router.get("/dashboard/reports", auth, async (req, res) => {
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

      const orders = await prisma.orderDelivery.findMany({
        where: ordersWhere,
        include: {
          Register: {
            include: {
              address: true,
            },
          },
        },
      });

      const byNeighborhood = Array.from(
        orders.reduce((totals, order) => {
          const neighborhood = order.Register?.address?.neighborhood?.trim();

          if (!neighborhood) {
            return totals;
          }

          totals.set(neighborhood, (totals.get(neighborhood) ?? 0) + 1);
          return totals;
        }, new Map<string, number>()),
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

      const byCity = Array.from(
        orders.reduce((totals, order) => {
          const city = order.Register?.address?.city?.trim();

          if (!city) {
            return totals;
          }

          totals.set(city, (totals.get(city) ?? 0) + 1);
          return totals;
        }, new Map<string, number>()),
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

      const completedOrders = orders.filter(
        (order) => order.status === OrderStatus.finished,
      ).length;
      const pendingOrders = orders.length - completedOrders;

      res.status(200).json({
        summary: {
          totalOrders: orders.length,
          completedOrders,
          pendingOrders,
          totalRevenue: orders
            .filter((order) => order.status === OrderStatus.finished)
            .reduce((sum, order) => sum + Number(order.amount ?? 0), 0),
        },
        byNeighborhood,
        byCity,
        byStatus: [
          { name: "Finalizadas", value: completedOrders },
          { name: "Pendentes", value: pendingOrders },
        ],
      });
    } catch {
      res.status(500).json({ error: "Falha ao carregar dados de relatórios do dashboard" });
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

  // Chat endpoints
  router.get("/chat/messages", auth, adaptRoute(makeLoadChatMessagesController()));
  router.get("/chat/search", auth, adaptRoute(makeSearchChatMessagesController()));
  router.get("/chat/messages/:id", auth, adaptRoute(makeLoadChatMessageByIdController()));
  router.post("/chat/messages", auth, adaptRoute(makeAddChatMessageController()));
  router.put("/chat/messages/:id", auth, adaptRoute(makeUpdateChatMessageController()));
  router.delete("/chat/messages/:id", auth, adaptRoute(makeDeleteChatMessageController()));
  router.get("/chat/statistics", auth, adaptRoute(makeGetChatStatisticsController()));

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
