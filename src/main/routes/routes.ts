import { Router } from "express";
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
import { makeLoadAccountsController } from "../factories/load-accounts";
import { makeUpdateAccountController } from "../factories/update-account";
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
import {
  makeGlobalSearchController,
  makeLoadDashboardOverviewController,
  makeLoadDashboardPerformanceController,
  makeLoadDashboardReportsController,
} from "../factories/dashboard";
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
import {
  ADMIN_ROLES,
  CATALOG_READ_ROLES,
  DASHBOARD_READ_ROLES,
  FIELD_WRITE_ROLES,
  OPERATOR_WRITE_ROLES,
} from "../config/roles";
import { loginRateLimit, refreshRateLimit } from "../middlewares";

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
  router.get(
    "/dashboard/overview",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardOverviewController()),
  );

  router.get(
    "/dashboard/performance",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardPerformanceController()),
  );

  router.get(
    "/dashboard/reports",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardReportsController()),
  );

  router.get("/search", auth(), adaptRoute(makeGlobalSearchController()));
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
  router.get(
    "/city",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadCityController()),
  );
  router.get(
    "/neighborhood",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadNeighborhoodController()),
  );
  router.get(
    "/deliveryman",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadDeliverymanController()),
  );
  router.get(
    "/product",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadProductController()),
  );
  router.get(
    "/product/:id",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadOneProductController()),
  );
  router.post(
    "/city",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddCityController()),
  );
  router.post(
    "/neighborhood",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddNeighborhoodController()),
  );
  router.post(
    "/deliveryman",
    auth(["admin"]),
    adaptRoute(makeAddDeliverymanController()),
  );
  router.post(
    "/product",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddProductController()),
  );
  router.post(
    "/register",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddRegisterController()),
  );

  /**
   * @swagger
   * /signup:
   *   post:
   *     tags: [Auth]
   *     summary: Cria uma conta com role "user" (somente admin)
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
  router.post(
    "/signup",
    loginRateLimit,
    auth(ADMIN_ROLES),
    adaptRoute(makeSignupController()),
  );

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
  router.post(
    "/login",
    loginRateLimit,
    adaptRoute(makeLoginController()),
  );

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
  router.post(
    "/refresh-token",
    refreshRateLimit,
    adaptRoute(makeRefreshTokenController()),
  );

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
  router.get(
    "/account",
    auth(["admin"]),
    adaptRoute(makeLoadAccountsController()),
  );
  router.put(
    "/account/:id",
    auth(["admin"]),
    adaptRoute(makeUpdateAccountController()),
  );

  router.post(
    "/orderDelivery",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.post(
    "/orderDelivery/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.put(
    "/register/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateRegisterController()),
  );
  router.put(
    "/client/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateClientController()),
  );
  router.put(
    "/address/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateAddressController()),
  );
  router.put(
    "/orderDelivery/:id",
    auth(FIELD_WRITE_ROLES),
    adaptRoute(makeUpdateOrderDeliveryController()),
  );
  router.put(
    "/deliveryman/:id",
    auth(["admin"]),
    adaptRoute(makeUpdateDeliverymanController()),
  );
  router.put(
    "/product/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateProductController()),
  );
  router.put(
    "/city/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateCityController()),
  );
  router.put(
    "/neighborhood/:id",
    auth(OPERATOR_WRITE_ROLES),
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
