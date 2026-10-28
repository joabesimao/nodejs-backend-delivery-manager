import { Request, Response, NextFunction, RequestHandler } from "express";
import { env } from "../../../config/Env";

const ALLOWED_HEADERS = "Content-Type, x-access-token, Authorization";
const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";

export const makeCors = (allowedOrigins?: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    if (!allowedOrigins) {
      res.set("access-control-allow-origin", "*");
    } else {
      res.vary("Origin");
      if (origin && allowedOrigins.includes(origin)) {
        res.set("access-control-allow-origin", origin);
      }
    }
    res.set("access-control-allow-headers", ALLOWED_HEADERS);
    res.set("access-control-allow-methods", ALLOWED_METHODS);

    if (req.method.toUpperCase() === "OPTIONS") {
      return res.status(204).send();
    }
    next();
  };
};

export const cors = makeCors(env.CORS_ORIGINS);
