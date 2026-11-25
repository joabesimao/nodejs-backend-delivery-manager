import { DbLoadDashboardReports } from "./db-load-dashboard-reports";

const makeSut = () => {
  const repository = {
    loadOrderLocations: jest.fn().mockResolvedValue([
      { status: "finished", amount: 50, neighborhood: " Centro ", city: "Natal" },
      { status: "finished", amount: null, neighborhood: "Centro", city: "Natal" },
      { status: "actived", amount: 30, neighborhood: null, city: "Parnamirim" },
    ]),
  };
  return { sut: new DbLoadDashboardReports(repository), repository };
};

describe("DbLoadDashboardReports", () => {
  test("Should filter by a valid range only", async () => {
    const { sut, repository } = makeSut();
    const startDate = new Date("2026-11-01");
    const endDate = new Date("2026-11-07");
    await sut.load({ startDate, endDate });
    expect(repository.loadOrderLocations).toHaveBeenLastCalledWith({ startDate, endDate });
    await sut.load({ startDate });
    expect(repository.loadOrderLocations).toHaveBeenLastCalledWith(undefined);
  });

  test("Should summarize by status, neighborhood and city", async () => {
    const { sut } = makeSut();
    expect(await sut.load({})).toEqual({
      summary: { totalOrders: 3, completedOrders: 2, pendingOrders: 1, totalRevenue: 50 },
      byNeighborhood: [{ name: "Centro", value: 2 }],
      byCity: [
        { name: "Natal", value: 2 },
        { name: "Parnamirim", value: 1 },
      ],
      byStatus: [
        { name: "Finalizadas", value: 2 },
        { name: "Pendentes", value: 1 },
      ],
    });
  });
});
