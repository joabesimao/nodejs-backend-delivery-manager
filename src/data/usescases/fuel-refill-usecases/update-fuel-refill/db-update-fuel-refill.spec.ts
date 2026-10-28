import { DbUpdateFuelRefill } from "./db-update-fuel-refill";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { InvalidKmError } from "../../../../presentation/errors";

const makeRefill = (override: Partial<FuelRefill> = {}): FuelRefill => ({
  id: 2,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1300,
  liters: 10,
  pricePerLiter: 6,
  totalValue: 60,
  refillDate: new Date("2026-09-15"),
  createdAt: new Date("2026-09-15"),
  ...override,
});

const makeSut = () => {
  const repo = {
    findById: jest.fn().mockResolvedValue(makeRefill()),
    loadAll: jest.fn().mockResolvedValue([
      makeRefill({ id: 1, km: 1000, refillDate: new Date("2026-09-10") }),
      makeRefill(),
      makeRefill({ id: 3, km: 1600, refillDate: new Date("2026-09-20") }),
    ]),
    update: jest.fn().mockResolvedValue(undefined),
    recalculateKmChain: jest.fn().mockResolvedValue(undefined),
  };
  const sut = new DbUpdateFuelRefill(repo, repo, repo, repo);
  return { sut, repo };
};

describe("DbUpdateFuelRefill Usecase", () => {
  test("Should return null if refill does not exist", async () => {
    const { sut, repo } = makeSut();
    repo.findById.mockResolvedValueOnce(null);
    expect(await sut.update(99, { km: 1400 })).toBeNull();
    expect(repo.update).not.toHaveBeenCalled();
  });

  test("Should throw InvalidKmError if km breaks the order of the vehicle refills", async () => {
    const { sut, repo } = makeSut();
    await expect(sut.update(2, { km: 1700 })).rejects.toBeInstanceOf(InvalidKmError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  test("Should update and recalculate the km chain of the vehicle", async () => {
    const { sut, repo } = makeSut();
    await sut.update(2, { km: 1400, pricePerLiter: 6.2 });
    expect(repo.loadAll).toHaveBeenCalledWith({ vehicleId: 1 });
    expect(repo.update).toHaveBeenCalledWith(2, { km: 1400, pricePerLiter: 6.2 });
    expect(repo.recalculateKmChain).toHaveBeenCalledTimes(1);
    expect(repo.recalculateKmChain).toHaveBeenCalledWith(1);
  });

  test("Should recalculate both vehicles when the refill moves to another vehicle", async () => {
    const { sut, repo } = makeSut();
    repo.loadAll.mockResolvedValueOnce([]);
    await sut.update(2, { vehicleId: 5 });
    expect(repo.loadAll).toHaveBeenCalledWith({ vehicleId: 5 });
    expect(repo.recalculateKmChain).toHaveBeenCalledWith(5);
    expect(repo.recalculateKmChain).toHaveBeenCalledWith(1);
  });
});
