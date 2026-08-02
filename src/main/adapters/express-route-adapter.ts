import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const requestWithAccount = req as Request & { accountId?: number };
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        ...req.query,
        accountId: requestWithAccount.accountId,
      },
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
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
        error: httpResponse.body.message,
      });
    }
  };
};
