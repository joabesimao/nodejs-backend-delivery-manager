import { UpdateOilChangeLogController } from "./update-oil-change-log";
import { badRequest, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { InvalidKmError } from "../../../errors";

const fakeLog = { id: 1, vehicleId: 1, km: 2100, nextChangeKm: 3100 };

const makeSut = () => {
  const updateOilChangeLog = { update: jest.fn().mockResolvedValue(fakeLog) };
  const validation = { validate: jest.fn().mockReturnValue(null) };
  const sut = new UpdateOilChangeLogController(updateOilChangeLog, validation);
  return { sut, updateOilChangeLog };
};

const makeRequest = () => ({
  params: { id: "1" },
  body: { vehicleId: "1", km: 2100, changeDate: "2026-09-23" },
});

describe("UpdateOilChangeLog Controller", () => {
  test("Should call UpdateOilChangeLog with converted values", async () => {
    const { sut, updateOilChangeLog } = makeSut();
    await sut.handle(makeRequest());
    expect(updateOilChangeLog.update).toHaveBeenCalledWith(1, {
      vehicleId: 1,
      km: 2100,
      changeDate: new Date("2026-09-23"),
    });
  });

  test("Should return noExists if log does not exist", async () => {
    const { sut, updateOilChangeLog } = makeSut();
    updateOilChangeLog.update.mockResolvedValueOnce(null);
    expect(await sut.handle(makeRequest())).toEqual(noExists());
  });

  test("Should return 400 on InvalidKmError", async () => {
    const { sut, updateOilChangeLog } = makeSut();
    updateOilChangeLog.update.mockRejectedValueOnce(new InvalidKmError());
    expect(await sut.handle(makeRequest())).toEqual(badRequest(new InvalidKmError()));
  });

  test("Should return 500 if UpdateOilChangeLog throws", async () => {
    const { sut, updateOilChangeLog } = makeSut();
    updateOilChangeLog.update.mockRejectedValueOnce(new Error());
    expect(await sut.handle(makeRequest())).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    expect(await sut.handle(makeRequest())).toEqual(ok(fakeLog));
  });
});
