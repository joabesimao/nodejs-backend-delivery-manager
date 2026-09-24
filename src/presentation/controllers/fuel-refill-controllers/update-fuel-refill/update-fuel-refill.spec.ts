import { UpdateFuelRefillController } from "./update-fuel-refill";
import { badRequest, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { InvalidKmError, InvalidParamError } from "../../../errors";

const fakeRefill = { id: 1, vehicleId: 1, km: 1200 };

const makeSut = () => {
  const updateFuelRefill = { update: jest.fn().mockResolvedValue(fakeRefill) };
  const validation = { validate: jest.fn().mockReturnValue(null) };
  const sut = new UpdateFuelRefillController(updateFuelRefill, validation);
  return { sut, updateFuelRefill, validation };
};

const makeRequest = () => ({
  params: { id: "1" },
  body: { km: "1200", pricePerLiter: 6.5, refillDate: "2026-09-23" },
});

describe("UpdateFuelRefill Controller", () => {
  test("Should call UpdateFuelRefill with converted values", async () => {
    const { sut, updateFuelRefill } = makeSut();
    await sut.handle(makeRequest());
    expect(updateFuelRefill.update).toHaveBeenCalledWith(1, {
      km: 1200,
      pricePerLiter: 6.5,
      refillDate: new Date("2026-09-23"),
    });
  });

  test("Should return 400 if validation fails", async () => {
    const { sut, validation } = makeSut();
    validation.validate.mockReturnValueOnce(new InvalidParamError("km"));
    expect(await sut.handle(makeRequest())).toEqual(badRequest(new InvalidParamError("km")));
  });

  test("Should return noExists if refill does not exist", async () => {
    const { sut, updateFuelRefill } = makeSut();
    updateFuelRefill.update.mockResolvedValueOnce(null);
    expect(await sut.handle(makeRequest())).toEqual(noExists());
  });

  test("Should return 400 on InvalidKmError", async () => {
    const { sut, updateFuelRefill } = makeSut();
    updateFuelRefill.update.mockRejectedValueOnce(new InvalidKmError("fora de ordem"));
    expect(await sut.handle(makeRequest())).toEqual(badRequest(new InvalidKmError("fora de ordem")));
  });

  test("Should return 500 if UpdateFuelRefill throws", async () => {
    const { sut, updateFuelRefill } = makeSut();
    updateFuelRefill.update.mockRejectedValueOnce(new Error());
    expect(await sut.handle(makeRequest())).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    expect(await sut.handle(makeRequest())).toEqual(ok(fakeRefill));
  });
});
