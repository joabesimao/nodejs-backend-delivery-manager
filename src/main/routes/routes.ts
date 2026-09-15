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
import { makeUpdateCityController } from "../factories/update-city";
import { makeDeleteCityController } from "../factories/delete-city";
import { makeUpdateNeighborhoodController } from "../factories/update-neighborhood";
import { makeDeleteNeighborhoodController } from "../factories/delete-neighborhood";
import { getAccountScope } from "../realtime/store-scope";
import { prisma } from "../../infra/db/mysql/helpers";
import { makeRefreshTokenController } from "../factories/refresh-token-factory";
import { makeLoadOrderDeliveryRankingController } from "../factories/load-order-delivery-ranking";
import { makeAddDeliverymanController } from "../factories/add-deliveryman";
import { makeLoadDeliverymanController } from "../factories/load-deliveryman";
import { makeUpdateDeliverymanController } from "../factories/update-deliveryman";
import { makeDeleteDeliverymanController } from "../factories/delete-deliveryman";
import { makeLoadChatMessagesController } from "../factories/load-chat-messages";
import { makeLoadChatMessageByIdController } from "../factories/load-chat-message-by-id";
import { makeAddChatMessageController } from "../factories/add-chat-message";
import { makeDeleteChatMessageController } from "../factories/delete-chat-message";
import { makeUpdateChatMessageController } from "../factories/update-chat-message";
import { makeSearchChatMessagesController } from "../factories/search-chat-messages";
import { makeGetChatStatisticsController } from "../factories/get-chat-statistics";
import { makeAddProductController } from "../factories/add-product";
import { makeLoadProductController } from "../factories/load-product";
import { makeLoadOneProductController } from "../factories/load-one-product";
import { makeUpdateProductController } from "../factories/update-product";
import { makeDeleteProductController } from "../factories/delete-product";

export default (router: Router): void => {
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/client", adaptRoute(makeLoadClientController()));
  router.get(
    "/orderDelivery",
    adaptRoute(makeLoadOrdersDeliveryController()),
  );
  router.get(
    "/orderDelivery/ranking/deliveryman",
    adaptRoute(makeLoadOrderDeliveryRankingController()),
  );
  router.get("/dashboard/overview", async (req, res) => {
    try {
      const startDateParam =
        typeof req.query.startDate === "string" ? req.query.startDate : undefined;
      const endDateParam =
        typeof req.query.endDate === "string" ? req.query.endDate : undefined;
      const parsedStart = startDateParam ? new Date(startDateParam) : undefined;
      const parsedEnd = endDateParam ? new Date(endDateParam) : undefined;
      const hasValidRange =
        parsedStart &&
        parsedEnd &&
        !Number.isNaN(parsedStart.getTime()) &&
        !Number.isNaN(parsedEnd.getTime());

      const ordersWhere = hasValidRange
        ? { data: { gte: parsedStart as Date, lte: parsedEnd as Date } }
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

      let previousDeliveredRevenue: number | null = null;
      if (hasValidRange) {
        const rangeMs = (parsedEnd as Date).getTime() - (parsedStart as Date).getTime();
        const previousEnd = new Date((parsedStart as Date).getTime() - 1);
        const previousStart = new Date(previousEnd.getTime() - rangeMs);

        const previousRevenueAgg = await prisma.orderDelivery.aggregate({
          where: {
            data: { gte: previousStart, lte: previousEnd },
            status: OrderStatus.finished,
          },
          _sum: { amount: true },
        });

        previousDeliveredRevenue = previousRevenueAgg._sum.amount ?? 0;
      }

      res.status(200).json({
        period: hasValidRange
          ? { startDate: parsedStart, endDate: parsedEnd }
          : null,
        metrics: {
          clients: clientsCount,
          deliverymen: deliverymenCount,
          activeDeliveries: activeDeliveriesCount,
          deliveredRevenue: deliveredRevenue._sum.amount ?? 0,
          deliveredRevenuePreviousPeriod: previousDeliveredRevenue,
          cities: citiesCount,
          neighborhoods: neighborhoodsCount,
        },
        latestDeliveries: latestOrders.map((order) => ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          clientName: order.Register.client.name,
          deliverymanName: order.deliveryman
            ? `${order.deliveryman.name} ${order.deliveryman.lastName}`.trim()
            : "Sem entregador",
        })),
      });
    } catch (error) {
      console.error("[dashboard/overview] Erro ao carregar dados:", error);
      res.status(500).json({ error: "Falha ao carregar dados do dashboard", details: String(error) });
    }
  });

  router.get("/dashboard/performance", async (req, res) => {
    try {
      const now = new Date();
      const defaultEnd = new Date(now);
      defaultEnd.setHours(23, 59, 59, 999);
      const defaultStart = new Date(now);
      defaultStart.setDate(defaultStart.getDate() - 6);
      defaultStart.setHours(0, 0, 0, 0);

      const startDateParam =
        typeof req.query.startDate === "string" ? req.query.startDate : undefined;
      const endDateParam =
        typeof req.query.endDate === "string" ? req.query.endDate : undefined;
      const parsedStart = startDateParam ? new Date(startDateParam) : undefined;
      const parsedEnd = endDateParam ? new Date(endDateParam) : undefined;

      const startDate =
        parsedStart && !Number.isNaN(parsedStart.getTime()) ? parsedStart : defaultStart;
      const endDate = parsedEnd && !Number.isNaN(parsedEnd.getTime()) ? parsedEnd : defaultEnd;

      const orders = await prisma.orderDelivery.findMany({
        where: { data: { gte: startDate, lte: endDate } },
        select: { data: true, finishedAt: true, status: true },
      });

      const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
      const totalsByDay = new Map<
        string,
        { date: string; label: string; total: number }
      >();

      orders.forEach((order) => {
        const dateKey = order.data.toISOString().slice(0, 10);

        if (!totalsByDay.has(dateKey)) {
          totalsByDay.set(dateKey, {
            date: dateKey,
            label: dayFormatter.format(order.data).replace(".", ""),
            total: 0,
          });
        }

        totalsByDay.get(dateKey)!.total += 1;
      });

      const days = Array.from(totalsByDay.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      );

      const finishedWithDuration = orders.filter(
        (order) => order.status === OrderStatus.finished && order.finishedAt,
      );

      const avgDeliveryMinutes = finishedWithDuration.length
        ? Math.round(
            finishedWithDuration.reduce(
              (sum, order) =>
                sum +
                ((order.finishedAt as Date).getTime() - order.data.getTime()) / 60000,
              0,
            ) / finishedWithDuration.length,
          )
        : null;

      const peakDay = days.reduce<(typeof days)[number] | null>(
        (peak, day) => (!peak || day.total > peak.total ? day : peak),
        null,
      );

      res.status(200).json({
        period: { startDate, endDate },
        days,
        totalOrders: orders.length,
        avgDeliveryMinutes,
        peakDay,
      });
    } catch (error) {
      console.error("[dashboard/performance] Erro ao carregar dados:", error);
      res
        .status(500)
        .json({ error: "Falha ao carregar desempenho do dashboard", details: String(error) });
    }
  });

  router.get("/dashboard/reports", async (req, res) => {
    try {
      const startDateParam =
        typeof req.query.startDate === "string" ? req.query.startDate : undefined;
      const endDateParam =
        typeof req.query.endDate === "string" ? req.query.endDate : undefined;
      const parsedStart = startDateParam ? new Date(startDateParam) : undefined;
      const parsedEnd = endDateParam ? new Date(endDateParam) : undefined;
      const hasValidRange =
        parsedStart &&
        parsedEnd &&
        !Number.isNaN(parsedStart.getTime()) &&
        !Number.isNaN(parsedEnd.getTime());

      const ordersWhere = hasValidRange
        ? { data: { gte: parsedStart as Date, lte: parsedEnd as Date } }
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
  router.get("/search", async (req, res) => {
    try {
      const term = typeof req.query.q === "string" ? req.query.q.trim() : "";

      if (term.length < 2) {
        res.status(200).json({ query: term, orders: [], clients: [], deliverymen: [] });
        return;
      }

      const RESULT_LIMIT = 5;
      const numericId = /^\d+$/.test(term) ? Number(term) : undefined;

      const [orders, clients, deliverymen] = await Promise.all([
        prisma.orderDelivery.findMany({
          where: {
            OR: [
              ...(numericId !== undefined ? [{ id: numericId }] : []),
              { Register: { client: { name: { contains: term } } } },
              { deliveryman: { name: { contains: term } } },
              { deliveryman: { lastName: { contains: term } } },
            ],
          },
          include: {
            deliveryman: true,
            Register: { include: { client: true, address: true } },
          },
          orderBy: { data: "desc" },
          take: RESULT_LIMIT,
        }),
        prisma.client.findMany({
          where: {
            OR: [
              { name: { contains: term } },
              { cpf: { contains: term } },
              { phone: { contains: term } },
            ],
          },
          take: RESULT_LIMIT,
        }),
        prisma.deliveryman.findMany({
          where: {
            OR: [
              { name: { contains: term } },
              { lastName: { contains: term } },
              { phone: { contains: term } },
            ],
          },
          take: RESULT_LIMIT,
        }),
      ]);

      res.status(200).json({
        query: term,
        orders: orders.map((order) => ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          clientName: order.Register?.client?.name ?? "",
          deliverymanName: order.deliveryman
            ? `${order.deliveryman.name} ${order.deliveryman.lastName}`.trim()
            : null,
        })),
        clients: clients.map((client) => ({
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          phone: client.phone,
        })),
        deliverymen: deliverymen.map((deliveryman) => ({
          id: deliveryman.id,
          name: deliveryman.name,
          lastName: deliveryman.lastName,
          phone: deliveryman.phone,
        })),
      });
    } catch (error) {
      console.error("[search] Erro ao buscar:", error);
      res.status(500).json({ error: "Falha ao realizar a busca" });
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
    adaptRoute(makeLoadOrderByIdController()),
  );
  router.get("/client/:id", adaptRoute(makeLoadOneClientController()));
  router.get("/city", adaptRoute(makeLoadCityController()));
  router.get("/neighborhood", adaptRoute(makeLoadNeighborhoodController()));
  router.get("/deliveryman", adaptRoute(makeLoadDeliverymanController()));
  router.get("/product", adaptRoute(makeLoadProductController()));
  router.get("/product/:id", adaptRoute(makeLoadOneProductController()));
  router.post("/city", adaptRoute(makeAddCityController()));
  router.post("/neighborhood", adaptRoute(makeAddNeighborhoodController()));
  router.post("/deliveryman", adaptRoute(makeAddDeliverymanController()));
  router.post("/product", adaptRoute(makeAddProductController()));
  router.post("/register", adaptRoute(makeAddRegisterController()));
  router.post("/signup", adaptRoute(makeSignupController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.post("/refresh-token", adaptRoute(makeRefreshTokenController()));
  router.post(
    "/orderDelivery",
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.post(
    "/orderDelivery/:id",
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.put("/client/:id", adaptRoute(makeUpdateClientController()));
  router.put("/address/:id", adaptRoute(makeUpdateAddressController()));
  router.put(
    "/orderDelivery/:id",
    adaptRoute(makeUpdateOrderDeliveryController()),
  );
  router.put("/deliveryman/:id", adaptRoute(makeUpdateDeliverymanController()));
  router.put("/product/:id", adaptRoute(makeUpdateProductController()));
  router.put("/city/:id", adaptRoute(makeUpdateCityController()));
  router.put("/neighborhood/:id", adaptRoute(makeUpdateNeighborhoodController()));
  router.delete(
    "/register/:id",

    adaptRoute(makeDeleteRegisterByIdController()),
  );
  router.delete(
    "/orderDelivery/:id",
    adaptRoute(makeDeleteOrderDeliveryController()),
  );
  router.delete(
    "/deliveryman/:id",
    adaptRoute(makeDeleteDeliverymanController()),
  );
  router.delete(
    "/product/:id",
    adaptRoute(makeDeleteProductController()),
  );
  router.delete(
    "/city/:id",
    adaptRoute(makeDeleteCityController()),
  );
  router.delete(
    "/neighborhood/:id",
    adaptRoute(makeDeleteNeighborhoodController()),
  );

  // Chat endpoints
  router.get("/chat/messages", adaptRoute(makeLoadChatMessagesController()));
  router.get("/chat/search", adaptRoute(makeSearchChatMessagesController()));
  router.get("/chat/messages/:id", adaptRoute(makeLoadChatMessageByIdController()));
  router.post("/chat/messages", adaptRoute(makeAddChatMessageController()));
  router.put("/chat/messages/:id", adaptRoute(makeUpdateChatMessageController()));
  router.delete("/chat/messages/:id", adaptRoute(makeDeleteChatMessageController()));
  router.get("/chat/statistics", adaptRoute(makeGetChatStatisticsController()));

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
