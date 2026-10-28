import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const tooManyRequests = (_req: Request, res: Response): void => {
  res
    .status(429)
    .json({ error: "Muitas tentativas. Tente novamente mais tarde." });
};

export const loginRateLimit = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooManyRequests,
});

export const refreshRateLimit = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooManyRequests,
});
