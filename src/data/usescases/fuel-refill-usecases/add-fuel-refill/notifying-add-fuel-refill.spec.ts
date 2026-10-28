import { NotifyingAddFuelRefill, OIL_CHANGE_WARNING_KM } from "./notifying-add-fuel-refill";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";

const makeRefillModel = (): AddFuelRefillModel => ({
  vehicleId: 1,
  deliverymanId: 1,
  km: 10000,
  liters: 20,
  pricePerLiter: 6,
  totalValue: 120,
  refillDate: new Date("2026-10-03T00:00:00.000Z"),
});

const makeRefill = (km = 10000): FuelRefill => ({
  id: 3,
  ...makeRefillModel(),
  km,
  createdAt: new Date("2026-10-03T00:00:00.000Z"),
  vehicle: { id: 1, plate: "ABC1D23", model: "CG 160" },
});

const makeOilLog = (km: number, nextChangeKm: number): OilChangeLog => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km,
  nextChangeKm,
  changeDate: new Date("2026-09-01T00:00:00.000Z"),
  createdAt: new Date("2026-09-01T00:00:00.000Z"),
});

const makeSut = (refill = makeRefill(), oilLogs: OilChangeLog[] = []) => {
  const inner = { add: jest.fn().mockResolvedValue(refill) };
  const oilRepository = { loadAll: jest.fn().mockResolvedValue(oilLogs) };
  const recipientsRepository = { loadRecipientIds: jest.fn().mockResolvedValue([1, 2]) };
  const notifyAccounts = { notify: jest.fn().mockResolvedValue(1) };
  const sut = new NotifyingAddFuelRefill(inner, oilRepository, recipientsRepository, notifyAccounts, [
    "admin",
    "gerente_estoque",
  ]);
  return { sut, inner, oilRepository, recipientsRepository, notifyAccounts };
};

const notifiedTypes = (notify: jest.Mock): string[] => notify.mock.calls.map(([model]) => model.type);

describe("NotifyingAddFuelRefill", () => {
  test("Should delegate to the wrapped use case and return its result", async () => {
    const { sut, inner } = makeSut();
    const context = { actorAccountId: 2 };
    const result = await sut.add(makeRefillModel(), context);
    expect(inner.add).toHaveBeenCalledWith(makeRefillModel(), context);
    expect(result).toEqual(makeRefill());
  });

  test("Should notify the managers except the actor about the refill", async () => {
    const { sut, recipientsRepository, notifyAccounts } = makeSut();
    await sut.add(makeRefillModel(), { actorAccountId: 2 });
    expect(recipientsRepository.loadRecipientIds).toHaveBeenCalledWith({ roles: ["admin", "gerente_estoque"] });
    expect(notifyAccounts.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientIds: [1],
        type: "fuel_refill_created",
        link: "/cadastros/abastecimento",
      })
    );
    expect(notifiedTypes(notifyAccounts.notify)).toEqual(["fuel_refill_created"]);
  });

  test("Should warn every manager once per cycle when the oil change is near", async () => {
    const nextChangeKm = 10000 + OIL_CHANGE_WARNING_KM;
    const { sut, notifyAccounts } = makeSut(makeRefill(), [makeOilLog(9000, nextChangeKm)]);
    await sut.add(makeRefillModel(), { actorAccountId: 2 });
    expect(notifyAccounts.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientIds: [1, 2],
        type: "oil_change_due",
        title: "Troca de óleo próxima",
        dedupeKey: `oil:vehicle:1:${nextChangeKm}:soon`,
        dedupe: "skip",
      })
    );
  });

  test("Should warn that the oil change is overdue", async () => {
    const { sut, notifyAccounts } = makeSut(makeRefill(10200), [makeOilLog(9000, 10000)]);
    await sut.add(makeRefillModel());
    expect(notifyAccounts.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "oil_change_due",
        title: "Troca de óleo vencida",
        dedupeKey: "oil:vehicle:1:10000:overdue",
      })
    );
  });

  test("Should not warn when the oil change is still far or the refill predates the last change", async () => {
    const far = makeSut(makeRefill(), [makeOilLog(9000, 10000 + OIL_CHANGE_WARNING_KM + 1)]);
    await far.sut.add(makeRefillModel());
    expect(notifiedTypes(far.notifyAccounts.notify)).toEqual(["fuel_refill_created"]);

    const retroactive = makeSut(makeRefill(8000), [makeOilLog(9000, 9100)]);
    await retroactive.sut.add(makeRefillModel());
    expect(notifiedTypes(retroactive.notifyAccounts.notify)).toEqual(["fuel_refill_created"]);
  });

  test("Should not fail the refill when notifying throws", async () => {
    const { sut, recipientsRepository } = makeSut();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    recipientsRepository.loadRecipientIds.mockRejectedValueOnce(new Error());
    await expect(sut.add(makeRefillModel())).resolves.toEqual(makeRefill());
  });

  test("Should propagate errors from the wrapped use case", async () => {
    const { sut, inner, notifyAccounts } = makeSut();
    inner.add.mockRejectedValueOnce(new Error("invalid km"));
    await expect(sut.add(makeRefillModel())).rejects.toThrow("invalid km");
    expect(notifyAccounts.notify).not.toHaveBeenCalled();
  });
});
