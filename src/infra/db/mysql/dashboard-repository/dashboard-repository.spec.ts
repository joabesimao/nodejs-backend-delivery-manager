import { DashboardMysqlRepository } from "./dashboard-repository";

const range = { startDate: new Date("2026-11-01"), endDate: new Date("2026-11-07") };

const makeFakePrisma = () => ({
  client: { count: jest.fn().mockResolvedValue(3) },
  deliveryman: { count: jest.fn().mockResolvedValue(2) },
  city: { count: jest.fn().mockResolvedValue(1) },
  neighborhood: { count: jest.fn().mockResolvedValue(4) },
  orderDelivery: {
    count: jest.fn().mockResolvedValue(5),
    aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 150 } }),
    findMany: jest.fn().mockResolvedValue([]),
  },
});

const makeSut = () => {
  const prisma = makeFakePrisma();
  return { sut: new DashboardMysqlRepository(prisma as never), prisma };
};

describe("Dashboard MySql Repository", () => {
  test("loadOverview() without range counts everything", async () => {
    const { sut, prisma } = makeSut();
    prisma.orderDelivery.findMany.mockResolvedValueOnce([
      { id: 1, status: "finished", amount: 50, Register: { client: { name: "Ana" } }, deliveryman: null },
    ]);
    const overview = await sut.loadOverview();
    expect(prisma.orderDelivery.count).toHaveBeenCalledWith({
      where: { status: { in: ["actived", "delivered"] } },
    });
    expect(prisma.orderDelivery.aggregate).toHaveBeenCalledWith({
      where: { status: "finished" },
      _sum: { amount: true },
    });
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: undefined,
      include: { Register: { include: { client: true } }, deliveryman: true },
      orderBy: { data: "desc" },
      take: 5,
    });
    expect(overview).toEqual({
      clients: 3,
      deliverymen: 2,
      cities: 1,
      neighborhoods: 4,
      activeDeliveries: 5,
      finishedRevenue: 150,
      latestOrders: [{ id: 1, status: "finished", amount: 50, clientName: "Ana", deliveryman: null }],
    });
  });

  test("loadOverview() filters orders by range and defaults revenue to 0", async () => {
    const { sut, prisma } = makeSut();
    prisma.orderDelivery.aggregate.mockResolvedValueOnce({ _sum: { amount: null } });
    const overview = await sut.loadOverview(range);
    expect(prisma.orderDelivery.count).toHaveBeenCalledWith({
      where: { data: { gte: range.startDate, lte: range.endDate }, status: { in: ["actived", "delivered"] } },
    });
    expect(overview.finishedRevenue).toBe(0);
  });

  test("loadFinishedRevenue() sums finished orders in the range", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.loadFinishedRevenue(range)).toBe(150);
    expect(prisma.orderDelivery.aggregate).toHaveBeenCalledWith({
      where: { data: { gte: range.startDate, lte: range.endDate }, status: "finished" },
      _sum: { amount: true },
    });
  });

  test("loadOrderTimeline() selects only the timeline fields", async () => {
    const { sut, prisma } = makeSut();
    await sut.loadOrderTimeline(range);
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: { data: { gte: range.startDate, lte: range.endDate } },
      select: { data: true, finishedAt: true, status: true },
    });
  });

  test("loadOrderLocations() maps the address of each order", async () => {
    const { sut, prisma } = makeSut();
    prisma.orderDelivery.findMany.mockResolvedValueOnce([
      { status: "finished", amount: 50, Register: { address: { neighborhood: "Centro", city: "Natal" } } },
      { status: "actived", amount: 30, Register: null },
    ]);
    const locations = await sut.loadOrderLocations(range);
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: { data: { gte: range.startDate, lte: range.endDate } },
      include: { Register: { include: { address: true } } },
    });
    expect(locations).toEqual([
      { status: "finished", amount: 50, neighborhood: "Centro", city: "Natal" },
      { status: "actived", amount: 30, neighborhood: null, city: null },
    ]);
  });
});
