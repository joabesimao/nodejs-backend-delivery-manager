import { DbUpdateOilChangeLog } from "./db-update-oil-change-log";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { InvalidKmError } from "../../../../presentation/errors";

const makeLog = (override: Partial<OilChangeLog> = {}): OilChangeLog => ({
  id: 2,
  vehicleId: 1,
  deliverymanId: 1,
  km: 2000,
  nextChangeKm: 3000,
  changeDate: new Date("2026-09-15"),
  createdAt: new Date("2026-09-15"),
  ...override,
});

const makeSut = () => {
  const repo = {
    findLogById: jest.fn().mockResolvedValue(makeLog()),
    loadAll: jest.fn().mockResolvedValue([
      makeLog({ id: 1, km: 1000, nextChangeKm: 2000, changeDate: new Date("2026-08-01") }),
      makeLog(),
    ]),
    updateLog: jest.fn().mockImplementation(async (id, data) => makeLog({ id, ...data })),
  };
  const sut = new DbUpdateOilChangeLog(repo, repo, repo);
  return { sut, repo };
};

describe("DbUpdateOilChangeLog Usecase", () => {
  test("Should return null if log does not exist", async () => {
    const { sut, repo } = makeSut();
    repo.findLogById.mockResolvedValueOnce(null);
    expect(await sut.update(99, { km: 2100 })).toBeNull();
    expect(repo.updateLog).not.toHaveBeenCalled();
  });

  test("Should throw InvalidKmError if km breaks the order of the vehicle logs", async () => {
    const { sut, repo } = makeSut();
    await expect(sut.update(2, { km: 900 })).rejects.toBeInstanceOf(InvalidKmError);
    expect(repo.updateLog).not.toHaveBeenCalled();
  });

  test("Should keep the original interval when recomputing nextChangeKm", async () => {
    const { sut, repo } = makeSut();
    await sut.update(2, { km: 2100 });
    expect(repo.updateLog).toHaveBeenCalledWith(2, { km: 2100, nextChangeKm: 3100 });
  });
});
