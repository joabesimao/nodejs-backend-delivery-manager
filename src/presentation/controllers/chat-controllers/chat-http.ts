import { HttpRequest, HttpResponse } from "../../protocols/http";

export const chatError = (statusCode: number, error: string): HttpResponse => ({
  statusCode,
  body: { error },
});

export const unauthenticated = (): HttpResponse => chatError(401, "Não autenticado");

export const invalidMessageId = (): HttpResponse => chatError(400, "ID de mensagem inválido");

export const readAccountId = (httpRequest: HttpRequest): number =>
  Number(httpRequest.headers?.accountId || 0);

export const readOptionalAccountId = (httpRequest: HttpRequest): number | undefined =>
  Number(httpRequest.headers?.accountId || 0) ||
  Number(httpRequest.query?.accountId || 0) ||
  undefined;
