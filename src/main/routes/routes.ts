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
import { makeLogoutController } from "../factories/logout-factory";
import { makeAddStaffAccountController } from "../factories/add-staff-account";

const auth = (roles?: string[]) => adaptMiddleware(makeAuthMiddleware(roles));

export default (router: Router): void => {
  router.get("/register", auth(), adaptRoute(makeLoadRegisterController()));
  router.get("/client", auth(), adaptRoute(makeLoadClientController()));
  router.get(
    "/orderDelivery",
    auth(),
    adaptRoute(makeLoadOrdersDeliveryController()),
  );
  router.get(
    "/orderDelivery/ranking/deliveryman",
    auth(),
    adaptRoute(makeLoadOrderDeliveryRankingController()),
  );
  router.get("/dashboard/overview", auth(), async (req, res) => {
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

  router.get("/dashboard/performance", auth(), async (req, res) => {
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

  router.get("/dashboard/reports", auth(), async (req, res) => {
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
  router.get("/search", auth(), async (req, res) => {
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
  router.get("/address", auth(), adaptRoute(makeLoadAddressController()));
  router.get(
    "/register/:id",
    auth(),
    adaptRoute(makeLoadRegisterByIdController()),
  );
  router.get(
    "/register/name/:name",
    auth(),
    adaptRoute(makeLoadRegisterByNameController()),
  );
  router.get(
    "/orderDelivery/:id",
    auth(),
    adaptRoute(makeLoadOrderByIdController()),
  );
  router.get("/client/:id", auth(), adaptRoute(makeLoadOneClientController()));
  router.get("/city", auth(), adaptRoute(makeLoadCityController()));
  router.get(
    "/neighborhood",
    auth(),
    adaptRoute(makeLoadNeighborhoodController()),
  );
  router.get(
    "/deliveryman",
    auth(),
    adaptRoute(makeLoadDeliverymanController()),
  );
  router.get("/product", auth(), adaptRoute(makeLoadProductController()));
  router.get(
    "/product/:id",
    auth(),
    adaptRoute(makeLoadOneProductController()),
  );
  router.post(
    "/city",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddCityController()),
  );
  router.post(
    "/neighborhood",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddNeighborhoodController()),
  );
  router.post(
    "/deliveryman",
    auth(["admin"]),
    adaptRoute(makeAddDeliverymanController()),
  );
  router.post(
    "/product",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddProductController()),
  );
  router.post(
    "/register",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddRegisterController()),
  );

  /**
   * @swagger
   * /signup:
   *   post:
   *     tags: [Auth]
   *     summary: Cria uma conta pública (sempre com role "user")
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password, passwordConfirmation]
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               passwordConfirmation:
   *                 type: string
   *     responses:
   *       200:
   *         description: Conta criada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *       400:
   *         description: Erro de validação
   *       403:
   *         description: E-mail já em uso
   */
  router.post("/signup", adaptRoute(makeSignupController()));

  /**
   * @swagger
   * /login:
   *   post:
   *     tags: [Auth]
   *     summary: Autentica uma conta e retorna access + refresh token
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       400:
   *         description: Erro de validação
   *       401:
   *         description: Credenciais inválidas
   */
  router.post("/login", adaptRoute(makeLoginController()));

  /**
   * @swagger
   * /refresh-token:
   *   post:
   *     tags: [Auth]
   *     summary: Rotaciona o par access+refresh token
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [refreshToken]
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: Novo par de tokens
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       400:
   *         description: Erro de validação
   *       401:
   *         description: Refresh token inválido, expirado ou já utilizado
   */
  router.post("/refresh-token", adaptRoute(makeRefreshTokenController()));

  /**
   * @swagger
   * /logout:
   *   post:
   *     tags: [Auth]
   *     summary: Revoga o refresh token da conta autenticada
   *     security:
   *       - accessToken: []
   *     responses:
   *       204:
   *         description: Logout realizado
   *       401:
   *         description: Não autenticado
   */
  router.post("/logout", auth(), adaptRoute(makeLogoutController()));

  /**
   * @swagger
   * /account/staff:
   *   post:
   *     tags: [Auth]
   *     summary: Cria uma conta de staff (admin, gerente_estoque ou entregador) — somente admin
   *     security:
   *       - accessToken: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password, passwordConfirmation, role]
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *               passwordConfirmation:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, gerente_estoque, entregador, user]
   *     responses:
   *       200:
   *         description: Conta de staff criada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 email:
   *                   type: string
   *                 role:
   *                   type: string
   *       400:
   *         description: Erro de validação
   *       401:
   *         description: Não autenticado
   *       403:
   *         description: Sem permissão (requer role admin) ou e-mail já em uso
   */
  router.post(
    "/account/staff",
    auth(["admin"]),
    adaptRoute(makeAddStaffAccountController()),
  );

  router.post(
    "/orderDelivery",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.post(
    "/orderDelivery/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.put(
    "/register/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateRegisterController()),
  );
  router.put(
    "/client/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateClientController()),
  );
  router.put(
    "/address/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateAddressController()),
  );
  router.put(
    "/orderDelivery/:id",
    auth(["admin", "entregador"]),
    adaptRoute(makeUpdateOrderDeliveryController()),
  );
  router.put(
    "/deliveryman/:id",
    auth(["admin"]),
    adaptRoute(makeUpdateDeliverymanController()),
  );
  router.put(
    "/product/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateProductController()),
  );
  router.put(
    "/city/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateCityController()),
  );
  router.put(
    "/neighborhood/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateNeighborhoodController()),
  );
  router.delete(
    "/register/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteRegisterByIdController()),
  );
  router.delete(
    "/orderDelivery/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteOrderDeliveryController()),
  );
  router.delete(
    "/deliveryman/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteDeliverymanController()),
  );
  router.delete(
    "/product/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteProductController()),
  );
  router.delete(
    "/city/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteCityController()),
  );
  router.delete(
    "/neighborhood/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteNeighborhoodController()),
  );

  // Chat endpoints
  router.get(
    "/chat/messages",
    auth(),
    adaptRoute(makeLoadChatMessagesController()),
  );
  router.get(
    "/chat/search",
    auth(),
    adaptRoute(makeSearchChatMessagesController()),
  );
  router.get(
    "/chat/messages/:id",
    auth(),
    adaptRoute(makeLoadChatMessageByIdController()),
  );
  router.post(
    "/chat/messages",
    auth(),
    adaptRoute(makeAddChatMessageController()),
  );
  router.put(
    "/chat/messages/:id",
    auth(),
    adaptRoute(makeUpdateChatMessageController()),
  );
  router.delete(
    "/chat/messages/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteChatMessageController()),
  );
  router.get(
    "/chat/statistics",
    auth(),
    adaptRoute(makeGetChatStatisticsController()),
  );

  router.delete(
    "/account/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteAccountController()),
  );

  router.delete(
    "/address/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteAddressController()),
  );

  router.delete(
    "/client/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteClientController()),
  );
};
