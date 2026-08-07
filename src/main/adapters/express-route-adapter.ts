import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    try {
      const requestWithAccount = req as Request & { accountId?: number };
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: {
          ...req.headers,
          accountId: requestWithAccount.accountId,
          accountRole: (req as any).accountRole,
          accountUnitStoreId: (req as any).accountUnitStoreId,
        },
      };
      const httpResponse = await controller.handle(httpRequest);
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res.status(httpResponse.statusCode).json(httpResponse.body);
      } else {
        const errorBody = httpResponse.body as any;
        const errorMessage = errorBody?.message || 
                            (errorBody instanceof Error ? errorBody.message : null) ||
                            "Erro desconhecido";
        if (httpResponse.statusCode >= 500) {
        console.error("[route] internal_error", {
          method: req.method,
          path: req.originalUrl,
          accountId: requestWithAccount.accountId ?? null,
          statusCode: httpResponse.statusCode,
          message: httpResponse.body?.message ?? "Internal server error",
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

