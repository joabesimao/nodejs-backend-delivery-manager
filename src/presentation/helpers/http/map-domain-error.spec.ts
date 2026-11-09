import {
  AccessDeniedError,
  AccountInUseError,
  BarcodeInUseError,
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
  VehicleInUseError,
} from "../../../domain/errors";
import { NoExistsError } from "../../errors/no-exists-error";
import { mapDomainError } from "./map-domain-error";

describe("mapDomainError", () => {
  test.each([
    ["AccessDeniedError", new AccessDeniedError()],
    ["EmailInUseError", new EmailInUseError()],
    ["LastAdminError", new LastAdminError()],
    ["SelfActionError", new SelfActionError()],
    ["OrderFieldChangeDeniedError", new OrderFieldChangeDeniedError()],
  ])("should map %s to 403 with the same error as body", (_, error) => {
    expect(mapDomainError(error)).toEqual({ statusCode: 403, body: error });
  });

  test.each([
    ["AccountInUseError", new AccountInUseError()],
    ["CpfInUseError", new CpfInUseError()],
    ["PlateInUseError", new PlateInUseError()],
    ["QualificationInUseError", new QualificationInUseError()],
    ["OrderStatusTransitionError", new OrderStatusTransitionError("delivered")],
    ["ResourceInUseError", new ResourceInUseError()],
    ["VehicleInUseError", new VehicleInUseError()],
  ])("should map %s to 409 with the same error as body", (_, error) => {
    expect(mapDomainError(error)).toEqual({ statusCode: 409, body: error });
  });

  test.each([
    ["InvalidKmError", new InvalidKmError()],
    ["BarcodeInUseError", new BarcodeInUseError()],
  ])("should map %s to 400 with the same error as body", (_, error) => {
    expect(mapDomainError(error)).toEqual({ statusCode: 400, body: error });
  });

  test("should map NotFoundError to 404 with NoExistsError body", () => {
    const response = mapDomainError(new NotFoundError());
    expect(response?.statusCode).toBe(404);
    expect(response?.body).toBeInstanceOf(NoExistsError);
  });

  test.each([
    ["a generic Error", new Error("boom")],
    ["a non-Error value", "boom"],
    ["undefined", undefined],
  ])("should return null for %s", (_, error) => {
    expect(mapDomainError(error)).toBeNull();
  });
});
