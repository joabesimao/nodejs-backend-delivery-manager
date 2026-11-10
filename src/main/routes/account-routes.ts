import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeDeleteAccountController } from "../factories/delete-account";
import { makeLoadAccountsController } from "../factories/load-accounts";
import { makeUpdateAccountController } from "../factories/update-account";
import { makeAddStaffAccountController } from "../factories/add-staff-account";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
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
  router.delete(
    "/account/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteAccountController()),
  );
};
