import { Controller } from "../../presentation/protocols/controller";
import { Actor, HttpRequest } from "../../presentation/protocols/http";
import { Request, Response } from "express";

type AuthenticatedRequest = Request & {
  accountId?: number;
  accountRole?: Actor["role"];
  accountUnitStoreId?: number | null;
};

const readActor = (req: AuthenticatedRequest): Actor | undefined => {
  if (typeof req.accountId !== "number" || !req.accountRole) return undefined;
  return {
    id: req.accountId,
    role: req.accountRole,
    unitStoreId: req.accountUnitStoreId ?? null,
  };
};

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const requestWithAccount = req as AuthenticatedRequest;
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: {
          ...req.headers,
          accountId: requestWithAccount.accountId,
          accountRole: requestWithAccount.accountRole,
          accountUnitStoreId: requestWithAccount.accountUnitStoreId,
        },
      };
      const actor = readActor(requestWithAccount);
      if (actor) httpRequest.actor = actor;
      const httpResponse = await controller.handle(httpRequest);
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
      } else {
        const errorBody = httpResponse.body;
        const errorMessage = errorBody?.message ||
                            (errorBody instanceof Error ? errorBody.message : null) ||
                            (typeof errorBody?.error === "string" ? errorBody.error : null) ||
                            "Erro desconhecido";
        if (httpResponse.statusCode >= 500) {
        console.error("[route] internal_error", {
          method: req.method,
          path: req.originalUrl,
          accountId: requestWithAccount.accountId ?? null,
          statusCode: httpResponse.statusCode,
          message: httpResponse.body?.message ?? httpResponse.body?.error ?? "Internal server error",
        });
      }

      res.status(httpResponse.statusCode).json({
          error: errorMessage,
        });
      }
    } catch (error) {
      console.error("Route error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
