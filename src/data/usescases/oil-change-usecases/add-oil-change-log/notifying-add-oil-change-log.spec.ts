import { NotifyingAddOilChangeLog } from "./notifying-add-oil-change-log";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";

const makeModel = (): AddOilChangeLogModel => ({
  vehicleId: 1,
  deliverymanId: 1,
  km: 10000,
  changeDate: new Date("2026-10-03T00:00:00.000Z"),
});

const makeLog = (): OilChangeLog => ({
  id: 5,
  ...makeModel(),
  nextChangeKm: 10800,
  createdAt: new Date("2026-10-03T00:00:00.000Z"),
  vehicle: { id: 1, plate: "ABC1D23", model: "CG 160" },
});

const makeSut = () => {
  const inner = { add: jest.fn().mockResolvedValue(makeLog()) };
  const recipientsRepository = { loadRecipientIds: jest.fn().mockResolvedValue([1]) };
  const notifyAccounts = { notify: jest.fn().mockResolvedValue(1) };
  const sut = new NotifyingAddOilChangeLog(inner, recipientsRepository, notifyAccounts, ["admin"]);
  return { sut, inner, recipientsRepository, notifyAccounts };
};

describe("NotifyingAddOilChangeLog", () => {
  test("Should delegate and notify the managers except the actor", async () => {
    const { sut, inner, recipientsRepository, notifyAccounts } = makeSut();
    const result = await sut.add(makeModel(), { actorAccountId: 2 });
    expect(inner.add).toHaveBeenCalledWith(makeModel(), { actorAccountId: 2 });
    expect(recipientsRepository.loadRecipientIds).toHaveBeenCalledWith({ roles: ["admin"], excludeAccountIds: [2] });
    expect(notifyAccounts.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientIds: [1],
        type: "oil_change_created",
        body: "CG 160 (ABC1D23): troca em 10.000 km. Próxima em 10.800 km.",
        link: "/cadastros/troca-oleo",
      })
    );
    expect(result).toEqual(makeLog());
  });

  test("Should not fail the oil change when notifying throws", async () => {
    const { sut, notifyAccounts } = makeSut();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    notifyAccounts.notify.mockRejectedValueOnce(new Error());
    await expect(sut.add(makeModel())).resolves.toEqual(makeLog());
  });
});
