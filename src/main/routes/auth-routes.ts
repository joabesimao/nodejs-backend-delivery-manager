import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignupController } from "../factories/signup";
import { makeLoginController } from "../factories/login-factory";
import { makeRefreshTokenController } from "../factories/refresh-token-factory";
import { makeLogoutController } from "../factories/logout-factory";
import { ADMIN_ROLES } from "../config/roles";
import { loginRateLimit, refreshRateLimit } from "../middlewares";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
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
};
