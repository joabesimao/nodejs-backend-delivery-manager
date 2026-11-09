import { DbLoadDashboardOverview } from "./db-load-dashboard-overview";

const makeOverview = () => ({
  clients: 3,
  deliverymen: 2,
  cities: 1,
  neighborhoods: 4,
  activeDeliveries: 5,
  finishedRevenue: 150,
  latestOrders: [
    { id: 1, status: "finished" as const, amount: 50, clientName: "Ana", deliveryman: { name: "João", lastName: "Silva" } },
    { id: 2, status: "actived" as const, amount: 30, clientName: "Bia", deliveryman: null },
  ],
});

const makeSut = () => {
  const repository = {
    loadOverview: jest.fn().mockResolvedValue(makeOverview()),
    loadFinishedRevenue: jest.fn().mockResolvedValue(80),
  };
  return { sut: new DbLoadDashboardOverview(repository), repository };
};

describe("DbLoadDashboardOverview", () => {
  test("Should load without period when the range is incomplete or invalid", async () => {
    const { sut, repository } = makeSut();
    const overview = await sut.load({ startDate: new Date("x"), endDate: new Date("2026-11-07") });
    expect(repository.loadOverview).toHaveBeenCalledWith(undefined);
    expect(repository.loadFinishedRevenue).not.toHaveBeenCalled();
    expect(overview.period).toBeNull();
    expect(overview.metrics.deliveredRevenuePreviousPeriod).toBeNull();
  });

  test("Should compare with the previous period of the same length", async () => {
    const { sut, repository } = makeSut();
    const startDate = new Date("2026-11-08T00:00:00.000Z");
    const endDate = new Date("2026-11-14T23:59:59.999Z");
    const overview = await sut.load({ startDate, endDate });
    expect(repository.loadOverview).toHaveBeenCalledWith({ startDate, endDate });
    expect(repository.loadFinishedRevenue).toHaveBeenCalledWith({
      startDate: new Date("2026-11-01T00:00:00.000Z"),
      endDate: new Date("2026-11-07T23:59:59.999Z"),
    });
    expect(overview.period).toEqual({ startDate, endDate });
    expect(overview.metrics.deliveredRevenuePreviousPeriod).toBe(80);
  });

  test("Should map the metrics and latest deliveries", async () => {
    const { sut } = makeSut();
    const overview = await sut.load({});
    expect(overview.metrics).toEqual({
      clients: 3,
      deliverymen: 2,
      activeDeliveries: 5,
      deliveredRevenue: 150,
      deliveredRevenuePreviousPeriod: null,
      cities: 1,
      neighborhoods: 4,
    });
    expect(overview.latestDeliveries).toEqual([
      { id: 1, status: "finished", amount: 50, clientName: "Ana", deliverymanName: "João Silva" },
      { id: 2, status: "actived", amount: 30, clientName: "Bia", deliverymanName: "Sem entregador" },
    ]);
  });

  test("Should throw if the repository throws", async () => {
    const { sut, repository } = makeSut();
    repository.loadOverview.mockRejectedValueOnce(new Error());
    await expect(sut.load({})).rejects.toThrow();
  });
});
