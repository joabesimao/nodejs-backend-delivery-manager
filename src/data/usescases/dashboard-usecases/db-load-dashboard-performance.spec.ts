import MockDate from "mockdate";
import { DbLoadDashboardPerformance } from "./db-load-dashboard-performance";

const makeSut = () => {
  const repository = { loadOrderTimeline: jest.fn().mockResolvedValue([]) };
  return { sut: new DbLoadDashboardPerformance(repository), repository };
};

describe("DbLoadDashboardPerformance", () => {
  afterEach(() => {
    MockDate.reset();
  });

  test("Should default to the last 7 days and return nulls without orders", async () => {
    MockDate.set(new Date(2026, 10, 9, 15, 0, 0));
    const { sut, repository } = makeSut();
    const performance = await sut.load({});
    const startDate = new Date(2026, 10, 3, 0, 0, 0, 0);
    const endDate = new Date(2026, 10, 9, 23, 59, 59, 999);
    expect(repository.loadOrderTimeline).toHaveBeenCalledWith({ startDate, endDate });
    expect(performance).toEqual({
      period: { startDate, endDate },
      days: [],
      totalOrders: 0,
      avgDeliveryMinutes: null,
      peakDay: null,
    });
  });

  test("Should group by day, average finished deliveries and find the peak", async () => {
    const { sut, repository } = makeSut();
    repository.loadOrderTimeline.mockResolvedValueOnce([
      { data: new Date("2026-11-03T12:00:00.000Z"), finishedAt: new Date("2026-11-03T12:30:00.000Z"), status: "finished" },
      { data: new Date("2026-11-02T12:00:00.000Z"), finishedAt: new Date("2026-11-02T13:00:00.000Z"), status: "finished" },
      { data: new Date("2026-11-03T15:00:00.000Z"), finishedAt: null, status: "actived" },
    ]);
    const startDate = new Date("2026-11-01T00:00:00.000Z");
    const endDate = new Date("2026-11-07T23:59:59.999Z");
    const performance = await sut.load({ startDate, endDate });
    expect(repository.loadOrderTimeline).toHaveBeenCalledWith({ startDate, endDate });
    expect(performance.days.map((day) => [day.date, day.total])).toEqual([
      ["2026-11-02", 1],
      ["2026-11-03", 2],
    ]);
    expect(performance.days[0].label).not.toContain(".");
    expect(performance.totalOrders).toBe(3);
    expect(performance.avgDeliveryMinutes).toBe(45);
    expect(performance.peakDay).toEqual(performance.days[1]);
  });
});
