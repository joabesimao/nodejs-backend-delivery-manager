/**
 * Testes de caracterização: congelam o contrato HTTP atual de GET /search
 * antes de extrair a lógica para um caso de uso (refatoração clean arch, fase 3).
 */
import request from "supertest";
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

let token: string;

beforeAll(async () => {
  token = await makeAccessToken(1);
});

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "info").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  mockAuthenticatedAccount(prisma, makeFakeAccount({ role: "entregador" }));
  prisma.orderDelivery.findMany.mockResolvedValue([]);
  prisma.client.findMany.mockResolvedValue([]);
  prisma.deliveryman.findMany.mockResolvedValue([]);
});

describe("GET /api/search", () => {
  test("responde 401 sem token", async () => {
    const response = await request(app).get("/api/search").query({ q: "ma" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test.each([undefined, "", " a "])(
    "termo %p (menos de 2 caracteres) retorna listas vazias sem consultar o banco",
    async (q) => {
      const response = await request(app)
        .get("/api/search")
        .query(q === undefined ? {} : { q })
        .set("x-access-token", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        query: (q ?? "").trim(),
        orders: [],
        clients: [],
        deliverymen: [],
      });
      expect(prisma.orderDelivery.findMany).not.toHaveBeenCalled();
      expect(prisma.client.findMany).not.toHaveBeenCalled();
      expect(prisma.deliveryman.findMany).not.toHaveBeenCalled();
    },
  );

  test("busca pedidos, clientes e entregadores e mapeia os campos públicos", async () => {
    prisma.orderDelivery.findMany.mockResolvedValue([
      {
        id: 7,
        status: "actived",
        amount: 42,
        deliveryman: { name: "Carlos", lastName: "Silva" },
        Register: { client: { name: "Maria" }, address: {} },
      },
      {
        id: 8,
        status: "finished",
        amount: 10,
        deliveryman: null,
        Register: null,
      },
    ]);
    prisma.client.findMany.mockResolvedValue([
      {
        id: 2,
        name: "Maria",
        cpf: "12345678900",
        phone: "8199999",
        status: true,
      },
    ]);
    prisma.deliveryman.findMany.mockResolvedValue([
      {
        id: 3,
        name: "Carlos",
        lastName: "Silva",
        phone: "8188888",
        cpf: "999",
      },
    ]);

    const response = await request(app)
      .get("/api/search")
      .query({ q: "  ma  " })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      query: "ma",
      orders: [
        {
          id: 7,
          status: "actived",
          amount: 42,
          clientName: "Maria",
          deliverymanName: "Carlos Silva",
        },
        {
          id: 8,
          status: "finished",
          amount: 10,
          clientName: "",
          deliverymanName: null,
        },
      ],
      clients: [{ id: 2, name: "Maria", cpf: "12345678900", phone: "8199999" }],
      deliverymen: [
        { id: 3, name: "Carlos", lastName: "Silva", phone: "8188888" },
      ],
    });

    const contains = { contains: "ma", mode: "insensitive" };
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { Register: { client: { name: contains } } },
          { deliveryman: { name: contains } },
          { deliveryman: { lastName: contains } },
        ],
      },
      include: {
        deliveryman: true,
        Register: { include: { client: true, address: true } },
      },
      orderBy: { data: "desc" },
      take: 5,
    });
    expect(prisma.client.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ name: contains }, { cpf: contains }, { phone: contains }],
      },
      take: 5,
    });
    expect(prisma.deliveryman.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ name: contains }, { lastName: contains }, { phone: contains }],
      },
      take: 5,
    });
  });

  test("termo numérico também busca o pedido pelo id", async () => {
    const response = await request(app)
      .get("/api/search")
      .query({ q: "42" })
      .set("x-access-token", token);

    expect(response.status).toBe(200);
    const where = prisma.orderDelivery.findMany.mock.calls[0][0].where;
    expect(where.OR[0]).toEqual({ id: 42 });
    expect(where.OR).toHaveLength(4);
  });

  test("erro no banco responde 500 com mensagem fixa", async () => {
    prisma.client.findMany.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .get("/api/search")
      .query({ q: "maria" })
      .set("x-access-token", token);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Falha ao realizar a busca" });
  });
});
