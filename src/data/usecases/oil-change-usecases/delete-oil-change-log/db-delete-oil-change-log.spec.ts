import { DbDeleteOilChangeLog } from "./db-delete-oil-change-log";

const makeSut = () => {
  const repo = {
    findLogById: jest.fn().mockResolvedValue({ id: 2, vehicleId: 1 }),
    deleteLog: jest.fn().mockResolvedValue(undefined),
  };
  const sut = new DbDeleteOilChangeLog(repo, repo);
  return { sut, repo };
};

describe("DbDeleteOilChangeLog Usecase", () => {
  test("Should return false if log does not exist", async () => {
    const { sut, repo } = makeSut();
    repo.findLogById.mockResolvedValueOnce(null);
    expect(await sut.delete(99)).toBe(false);
    expect(repo.deleteLog).not.toHaveBeenCalled();
  });

  test("Should delete the log", async () => {
    const { sut, repo } = makeSut();
    expect(await sut.delete(2)).toBe(true);
    expect(repo.deleteLog).toHaveBeenCalledWith(2);
  });
});
