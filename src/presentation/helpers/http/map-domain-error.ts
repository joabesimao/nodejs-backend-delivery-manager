import {
  AccessDeniedError,
  AccountInUseError,
  CpfInUseError,
  EmailInUseError,
  InvalidKmError,
  LastAdminError,
  NotFoundError,
  OrderFieldChangeDeniedError,
  OrderStatusTransitionError,
  PlateInUseError,
  QualificationInUseError,
  ResourceInUseError,
  SelfActionError,
} from "../../../domain/errors";
import { HttpResponse } from "../../protocols/http";
import { badRequest, conflict, forbidden, noExists } from "./http-helper";

type ErrorClass = new (...args: any[]) => Error;

const domainErrorMappings: Array<[ErrorClass[], (error: Error) => HttpResponse]> = [
  [
    [
      AccessDeniedError,
      EmailInUseError,
      LastAdminError,
      SelfActionError,
      OrderFieldChangeDeniedError,
    ],
    forbidden,
  ],
  [
    [
      AccountInUseError,
      CpfInUseError,
      PlateInUseError,
      QualificationInUseError,
      OrderStatusTransitionError,
      ResourceInUseError,
    ],
    conflict,
  ],
  [[InvalidKmError], badRequest],
  [[NotFoundError], () => noExists()],
];

export const mapDomainError = (error: unknown): HttpResponse | null => {
  if (!(error instanceof Error)) {
    return null;
  }
  const mapping = domainErrorMappings.find(([classes]) =>
    classes.some((errorClass) => error instanceof errorClass),
  );
  return mapping ? mapping[1](error) : null;
};
