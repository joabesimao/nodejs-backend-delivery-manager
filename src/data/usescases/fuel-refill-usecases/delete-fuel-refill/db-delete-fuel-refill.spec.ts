import { DbDeleteFuelRefill } from "./db-delete-fuel-refill";

const makeSut = () => {
  const repo = {
    findById: jest.fn().mockResolvedValue({ id: 2, vehicleId: 1 }),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    recalculateKmChain: jest.fn().mockResolvedValue(undefined),
  };
  const sut = new DbDeleteFuelRefill(repo, repo, repo);
  return { sut, repo };
};

describe("DbDeleteFuelRefill Usecase", () => {
  test("Should return false if refill does not exist", async () => {
    const { sut, repo } = makeSut();
    repo.findById.mockResolvedValueOnce(null);
    expect(await sut.delete(99)).toBe(false);
    expect(repo.deleteOne).not.toHaveBeenCalled();
  });

  test("Should delete and recalculate the km chain of the vehicle", async () => {
    const { sut, repo } = makeSut();
    expect(await sut.delete(2)).toBe(true);
    expect(repo.deleteOne).toHaveBeenCalledWith(2);
    expect(repo.recalculateKmChain).toHaveBeenCalledWith(1);
  });
});
