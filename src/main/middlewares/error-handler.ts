import { NextFunction, Request, Response } from "express";

type HttpError = Error & { type?: string; status?: number };

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ error: "Rota não encontrada" });
};

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error.type === "entity.parse.failed") {
    res.status(400).json({ error: "JSON inválido no corpo da requisição" });
    return;
  }

  if (error.type === "entity.too.large") {
    res.status(413).json({ error: "Corpo da requisição excede o tamanho máximo" });
    return;
  }

  if (error.status && error.status >= 400 && error.status < 500) {
    res.status(error.status).json({ error: "Requisição inválida" });
    return;
  }

  console.error("[app] unhandled_error", {
    method: req.method,
    path: req.originalUrl,
    error,
  });
  res.status(500).json({ error: "Internal server error" });
};
