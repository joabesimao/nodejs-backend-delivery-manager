import { NextFunction, Request, Response } from "express";

type HttpError = Error & { type?: string; status?: number };

// Rota /api inexistente: responde JSON em vez do HTML padrão do Express.
export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ error: "Rota não encontrada" });
};

// Último middleware do app: substitui o handler padrão do Express, que devolve
// HTML com stack trace quando NODE_ENV não é "production".
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
