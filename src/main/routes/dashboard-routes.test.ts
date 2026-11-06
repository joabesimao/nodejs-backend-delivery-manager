/**
 * Testes de caracterização: congelam o contrato HTTP atual de /dashboard/*
 * antes de extrair a lógica para casos de uso (refatoração clean arch, fase 3).
 * O Prisma é simulado; a autenticação usa JWT real.
 */
import request from "supertest";
import MockDate from "mockdate";
import {
  PrismaMock,
  makeAccessToken,
  makeFakeAccount,
  mockAuthenticatedAccount,
} from "../../test/route-harness";
import { prisma as prismaClient } from "../../infra/db/mysql/helpers";
import app from "../config/app";

jest.mock("../../infra/db/mysql/helpers", () => ({
  prisma: jest.requireActual("../../test/route-harness").createPrismaMock(),
}));

const prisma = prismaClient as unknown as PrismaMock;

const makeOrder = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  quantity: "1",
  amount: 100,
  data: new Date("2026-11-02T12:00:00.000Z"),
  finishedAt: null,
  status: "actived",
  deliveryman: { id: 3, name: "Carlos", lastName: "Silva" },
  Register: {
    client: { id: 2, name: "Maria" },
    address: { city: "Recife", neighborhood: "Boa Viagem" },
  },
  ...overrides,
});

let token: string;

beforeAll(async () => {
  token = await makeAccessToken(1);
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "info").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  mockAuthenticatedAccount(prisma, makeFakeAccount({ role: "admin" }));
});

afterEach(() => {
  MockDate.reset();
});

describe("Autorização do dashboard", () => {
  test.each([
    "/dashboard/overview",
    "/dashboard/performance",
    "/dashboard/reports",
  ])("%s responde 401 sem token", async (path) => {
    const response = await request(app).get(`/api${path}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test.each([
    "/dashboard/overview",
    "/dashboard/performance",
    "/dashboard/reports",
  ])("%s responde 403 para entregador", async (path) => {
    mockAuthenticatedAccount(prisma, makeFakeAccount({ role: "entregador" }));
    const response = await request(app)
      .get(`/api${path}`)
      .set("x-access-token", token);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Access Denied" });
  });
});

describe("GET /api/dashboard/overview", () => {
  const arrangeOverview = () => {
    prisma.client.count.mockResolvedValue(10);
    prisma.deliveryman.count.mockResolvedValue(4);
    prisma.city.count.mockResolvedValue(2);
    prisma.neighborhood.count.mockResolvedValue(7);
    prisma.orderDelivery.count.mockResolvedValue(3);
    prisma.orderDelivery.aggregate.mockResolvedValue({ _sum: { amount: 250 } });
    prisma.orderDelivery.findMany.mockResolvedValue([
      makeOrder(),
      makeOrder({ id: 2, status: "finished", amount: 50, deliveryman: null }),
    ]);
  };

  test("sem período retorna as métricas gerais e period null", async () => {
    arrangeOverview();

    const response = await request(app)
      .get("/api/dashboard/overview")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      period: null,
      metrics: {
        clients: 10,
        deliverymen: 4,
        activeDeliveries: 3,
        deliveredRevenue: 250,
        deliveredRevenuePreviousPeriod: null,
        cities: 2,
        neighborhoods: 7,
      },
      latestDeliveries: [
        {
          id: 1,
          status: "actived",
          amount: 100,
          clientName: "Maria",
          deliverymanName: "Carlos Silva",
        },
        {
          id: 2,
          status: "finished",
          amount: 50,
          clientName: "Maria",
          deliverymanName: "Sem entregador",
        },
      ],
    });
    expect(prisma.orderDelivery.count).toHaveBeenCalledWith({
      where: { status: { in: ["actived", "delivered"] } },
    });
    expect(prisma.orderDelivery.aggregate).toHaveBeenCalledTimes(1);
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: undefined,
        orderBy: { data: "desc" },
        take: 5,
      }),
    );
  });

  test("com período filtra por data e compara com o período anterior", async () => {
    arrangeOverview();
    prisma.orderDelivery.aggregate
      .mockResolvedValueOnce({ _sum: { amount: 250 } })
      .mockResolvedValueOnce({ _sum: { amount: null } });

    const startDate = "2026-11-01T00:00:00.000Z";
    const endDate = "2026-11-07T23:59:59.999Z";
    const response = await request(app)
      .get("/api/dashboard/overview")
      .query({ startDate, endDate })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.period).toEqual({ startDate, endDate });
    expect(response.body.metrics.deliveredRevenue).toBe(250);
    expect(response.body.metrics.deliveredRevenuePreviousPeriod).toBe(0);

    const range = { gte: new Date(startDate), lte: new Date(endDate) };
    expect(prisma.orderDelivery.count).toHaveBeenCalledWith({
      where: { data: range, status: { in: ["actived", "delivered"] } },
    });

    const previousEnd = new Date(new Date(startDate).getTime() - 1);
    const rangeMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    expect(prisma.orderDelivery.aggregate).toHaveBeenLastCalledWith({
      where: {
        data: {
          gte: new Date(previousEnd.getTime() - rangeMs),
          lte: previousEnd,
        },
        status: "finished",
      },
      _sum: { amount: true },
    });
  });

  test("datas inválidas são ignoradas (sem filtro)", async () => {
    arrangeOverview();

    const response = await request(app)
      .get("/api/dashboard/overview")
      .query({ startDate: "abc", endDate: "2026-11-07" })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.period).toBeNull();
  });

  test("erro no banco responde 500 com mensagem fixa", async () => {
    arrangeOverview();
    prisma.client.count.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .get("/api/dashboard/overview")
      .set("x-access-token", token);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Falha ao carregar dados do dashboard",
    });
  });
});

describe("GET /api/dashboard/performance", () => {
  test("agrupa pedidos por dia, calcula média de entrega e pico", async () => {
    prisma.orderDelivery.findMany.mockResolvedValue([
      {
        data: new Date("2026-11-02T12:00:00.000Z"),
        finishedAt: new Date("2026-11-02T12:30:00.000Z"),
        status: "finished",
      },
      {
        data: new Date("2026-11-03T12:00:00.000Z"),
        finishedAt: new Date("2026-11-03T13:00:00.000Z"),
        status: "finished",
      },
      {
        data: new Date("2026-11-03T14:00:00.000Z"),
        finishedAt: null,
        status: "actived",
      },
    ]);

    const startDate = "2026-11-01T00:00:00.000Z";
    const endDate = "2026-11-07T23:59:59.999Z";
    const response = await request(app)
      .get("/api/dashboard/performance")
      .query({ startDate, endDate })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      period: { startDate, endDate },
      days: [
        { date: "2026-11-02", label: "seg", total: 1 },
        { date: "2026-11-03", label: "ter", total: 2 },
      ],
      totalOrders: 3,
      avgDeliveryMinutes: 45,
      peakDay: { date: "2026-11-03", label: "ter", total: 2 },
    });
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: { data: { gte: new Date(startDate), lte: new Date(endDate) } },
      select: { data: true, finishedAt: true, status: true },
    });
  });

  test("sem período usa os últimos 7 dias e retorna nulos sem pedidos", async () => {
    MockDate.set(new Date("2026-11-06T15:00:00.000Z"));
    prisma.orderDelivery.findMany.mockResolvedValue([]);

    const response = await request(app)
      .get("/api/dashboard/performance")
      .set("x-access-token", token);

    const expectedEnd = new Date();
    expectedEnd.setHours(23, 59, 59, 999);
    const expectedStart = new Date();
    expectedStart.setDate(expectedStart.getDate() - 6);
    expectedStart.setHours(0, 0, 0, 0);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      period: {
        startDate: expectedStart.toISOString(),
        endDate: expectedEnd.toISOString(),
      },
      days: [],
      totalOrders: 0,
      avgDeliveryMinutes: null,
      peakDay: null,
    });
  });

  test("erro no banco responde 500 com mensagem fixa", async () => {
    prisma.orderDelivery.findMany.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .get("/api/dashboard/performance")
      .set("x-access-token", token);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Falha ao carregar desempenho do dashboard",
    });
  });
});

describe("GET /api/dashboard/reports", () => {
  test("resume por status, bairro e cidade", async () => {
    prisma.orderDelivery.findMany.mockResolvedValue([
      makeOrder({ id: 1, status: "finished", amount: 100 }),
      makeOrder({ id: 2, status: "finished", amount: 50.5 }),
      makeOrder({
        id: 3,
        status: "actived",
        amount: 30,
        Register: {
          address: { city: " Olinda ", neighborhood: "Casa Caiada" },
        },
      }),
      makeOrder({
        id: 4,
        status: "delivered",
        amount: 20,
        Register: { address: null },
      }),
    ]);

    const response = await request(app)
      .get("/api/dashboard/reports")
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      summary: {
        totalOrders: 4,
        completedOrders: 2,
        pendingOrders: 2,
        totalRevenue: 150.5,
      },
      byNeighborhood: [
        { name: "Boa Viagem", value: 2 },
        { name: "Casa Caiada", value: 1 },
      ],
      byCity: [
        { name: "Recife", value: 2 },
        { name: "Olinda", value: 1 },
      ],
      byStatus: [
        { name: "Finalizadas", value: 2 },
        { name: "Pendentes", value: 2 },
      ],
    });
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: undefined,
      include: { Register: { include: { address: true } } },
    });
  });

  test("com período filtra por data", async () => {
    prisma.orderDelivery.findMany.mockResolvedValue([]);
    const startDate = "2026-11-01T00:00:00.000Z";
    const endDate = "2026-11-07T23:59:59.999Z";

    const response = await request(app)
      .get("/api/dashboard/reports")
      .query({ startDate, endDate })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body.summary).toEqual({
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
    });
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { data: { gte: new Date(startDate), lte: new Date(endDate) } },
      }),
    );
  });

  test("erro no banco responde 500 com mensagem fixa", async () => {
    prisma.orderDelivery.findMany.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .get("/api/dashboard/reports")
      .set("x-access-token", token);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Falha ao carregar dados de relatórios do dashboard",
    });
  });
});
