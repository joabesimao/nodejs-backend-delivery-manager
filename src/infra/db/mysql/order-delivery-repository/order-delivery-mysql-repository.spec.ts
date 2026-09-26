import { OrderDeliveryMySqlRepository } from "./order-delivery-mysql-repository";
import { emitDeliveryRealtime } from "../../../../main/realtime/realtime-state";
import {
  getAccountScope,
  resolveRootStoreId,
} from "../../../../main/realtime/store-scope";

jest.mock("../../../../main/realtime/realtime-state", () => ({
  emitDeliveryRealtime: jest.fn(),
}));

jest.mock("../../../../main/realtime/store-scope", () => ({
  getAccountScope: jest.fn(),
  resolveRootStoreId: jest.fn(),
}));

const mockedEmitDeliveryRealtime = emitDeliveryRealtime as jest.Mock;
const mockedGetAccountScope = getAccountScope as jest.Mock;
const mockedResolveRootStoreId = resolveRootStoreId as jest.Mock;

const FIXED_DATE = new Date("2024-01-01T00:00:00.000Z");

const makeFakeOrder = (overrides: Partial<any> = {}) => ({
  id: 1,
  registerId: 1,
  unitStoreId: 10,
  deliverymanId: null,
  amount: 100,
  quantity: "1",
  data: FIXED_DATE,
  receivedAt: FIXED_DATE,
  finishedAt: null,
  status: "actived",
  unitStore: { id: 10 },
  deliveryman: null,
  Register: { id: 1, client: {}, address: {} },
  ...overrides,
});

const makeFakePrisma = () => ({
  orderDelivery: {
    findMany: jest.fn().mockResolvedValue([makeFakeOrder()]),
    create: jest.fn().mockResolvedValue(makeFakeOrder()),
    findUnique: jest.fn().mockResolvedValue(makeFakeOrder()),
    update: jest.fn().mockResolvedValue(makeFakeOrder()),
    delete: jest.fn().mockResolvedValue({}),
  },
  register: {
    findUnique: jest.fn().mockResolvedValue({ id: 1 }),
  },
  deliveryman: {
    findUnique: jest.fn().mockResolvedValue({ id: 1 }),
  },
  unitStore: {
    findUnique: jest.fn().mockResolvedValue({ id: 10 }),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): {
  sut: OrderDeliveryMySqlRepository;
  prisma: FakePrisma;
} => {
  const prisma = makeFakePrisma();
  const sut = new OrderDeliveryMySqlRepository(prisma as any);
  return { sut, prisma };
};

describe("OrderDelivery MySql Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAccountScope.mockResolvedValue(null);
    mockedResolveRootStoreId.mockResolvedValue(99);
  });

  describe("getAllOrderOfDelivery()", () => {
    test("Should call prisma.orderDelivery.findMany with undefined where when no accountId is given", async () => {
      const { sut, prisma } = makeSut();
      await sut.getAllOrderOfDelivery();
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          unitStore: true,
          deliveryman: true,
          Register: { include: { client: true, address: true } },
        },
      });
    });

    test("Should call getAccountScope and filter by visibleUnitIds when accountId is given and scope has visible units", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({
        visibleUnitIds: [10, 20],
      });
      await sut.getAllOrderOfDelivery(5);
      expect(mockedGetAccountScope).toHaveBeenCalledWith(prisma, 5);
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { unitStoreId: { in: [10, 20] } },
        }),
      );
    });

    test("Should use undefined where when scope has no visible units", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [] });
      await sut.getAllOrderOfDelivery(5);
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined }),
      );
    });

    test("Should use undefined where when scope is null", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce(null);
      await sut.getAllOrderOfDelivery(5);
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: undefined }),
      );
    });

    test("Should return a list of orders on success", async () => {
      const { sut } = makeSut();
      const orders = await sut.getAllOrderOfDelivery();
      expect(orders).toEqual([makeFakeOrder()]);
    });

    test("Should throw if prisma.orderDelivery.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.getAllOrderOfDelivery()).rejects.toThrow();
    });
  });

  describe("addOrderOfDelivery()", () => {
    const makeFakeAddOrder = () => ({
      registerId: 1,
      quantity: "1",
      amount: 100,
      data: new Date(),
    });

    test("Should throw if register does not exist", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.findUnique.mockResolvedValueOnce(null);
      await expect(sut.addOrderOfDelivery(makeFakeAddOrder())).rejects.toThrow(
        "Cadastro nao encontrado",
      );
    });

    test("Should call prisma.register.findUnique with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(prisma.register.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true },
      });
    });

    test("Should throw if deliverymanId is given but deliveryman does not exist", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findUnique.mockResolvedValueOnce(null);
      await expect(
        sut.addOrderOfDelivery({ ...makeFakeAddOrder(), deliverymanId: 7 }),
      ).rejects.toThrow("Entregador nao encontrado");
    });

    test("Should not check deliveryman when deliverymanId is not given", async () => {
      const { sut, prisma } = makeSut();
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(prisma.deliveryman.findUnique).not.toHaveBeenCalled();
    });

    test("Should not resolve scope when accountId is not given", async () => {
      const { sut } = makeSut();
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
    });

    test("Should throw if scope has unitStoreId but unitStore does not exist", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ unitStoreId: 10 });
      prisma.unitStore.findUnique.mockResolvedValueOnce(null);
      await expect(
        sut.addOrderOfDelivery({ ...makeFakeAddOrder(), accountId: 3 }),
      ).rejects.toThrow("Conta vinculada a loja inexistente");
    });

    test("Should create the order with scoped unitStoreId and deliverymanId when provided", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ unitStoreId: 10 });
      await sut.addOrderOfDelivery({
        ...makeFakeAddOrder(),
        accountId: 3,
        deliverymanId: 7,
      });
      const callArg = prisma.orderDelivery.create.mock.calls[0][0];
      expect(callArg.data.unitStoreId).toBe(10);
      expect(callArg.data.deliverymanId).toBe(7);
    });

    test("Should create the order without unitStoreId when scope has no unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      const callArg = prisma.orderDelivery.create.mock.calls[0][0];
      expect(callArg.data.unitStoreId).toBeUndefined();
      expect(callArg.data.deliverymanId).toBeUndefined();
    });

    test("Should resolve rootStoreId and emit realtime event when order has unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.create.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: 10 }),
      );
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(mockedResolveRootStoreId).toHaveBeenCalledWith(prisma, 10);
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith({
        eventType: "created",
        unitStoreId: 10,
        rootStoreId: 99,
        order: makeFakeOrder({ unitStoreId: 10 }),
      });
    });

    test("Should not resolve rootStoreId and emit with null values when order has no unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.create.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: null }),
      );
      await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(mockedResolveRootStoreId).not.toHaveBeenCalled();
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith(
        expect.objectContaining({ unitStoreId: null, rootStoreId: null }),
      );
    });

    test("Should return the created order", async () => {
      const { sut } = makeSut();
      const order = await sut.addOrderOfDelivery(makeFakeAddOrder());
      expect(order).toEqual(makeFakeOrder());
    });

    test("Should throw if prisma.orderDelivery.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.create.mockRejectedValueOnce(new Error());
      await expect(
        sut.addOrderOfDelivery(makeFakeAddOrder()),
      ).rejects.toThrow();
    });
  });

  describe("getOneOrderOfDelivery()", () => {
    test("Should call prisma.orderDelivery.findUnique with correct params", async () => {
      const { sut, prisma } = makeSut();
      await sut.getOneOrderOfDelivery(1);
      expect(prisma.orderDelivery.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          unitStore: true,
          deliveryman: true,
          Register: { include: { client: true, address: true } },
        },
      });
    });

    test("Should return null if order is not found", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce(null);
      const order = await sut.getOneOrderOfDelivery(1);
      expect(order).toBeNull();
    });

    test("Should not check scope when accountId is not given", async () => {
      const { sut } = makeSut();
      await sut.getOneOrderOfDelivery(1);
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
    });

    test("Should throw if accountId is given and order's unit is not visible in scope", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: 50 }),
      );
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10] });
      await expect(sut.getOneOrderOfDelivery(1, 3)).rejects.toThrow(
        "Sem permissao para visualizar entrega dessa loja",
      );
    });

    test("Should return the order when accountId is given and scope allows it", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: 10 }),
      );
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10] });
      const order = await sut.getOneOrderOfDelivery(1, 3);
      expect(order).toEqual(makeFakeOrder({ unitStoreId: 10 }));
    });

    test("Should return the order when scope is null", async () => {
      const { sut } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce(null);
      const order = await sut.getOneOrderOfDelivery(1, 3);
      expect(order).toEqual(makeFakeOrder());
    });

    test("Should return the order when scope has no visible units", async () => {
      const { sut } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [] });
      const order = await sut.getOneOrderOfDelivery(1, 3);
      expect(order).toEqual(makeFakeOrder());
    });

    test("Should throw if prisma.orderDelivery.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.getOneOrderOfDelivery(1)).rejects.toThrow();
    });
  });

  describe("getDeliverymanRankingByPeriod()", () => {
    const makeFilter = (overrides: Partial<any> = {}) => ({
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      page: 1,
      pageSize: 10,
      ...overrides,
    });

    test("Should not resolve scope when accountId is not given", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([]);
      await sut.getDeliverymanRankingByPeriod(makeFilter());
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
    });

    test("Should use delivered/finished status when status is 'all' or not given", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([]);
      await sut.getDeliverymanRankingByPeriod(makeFilter());
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: { in: ["delivered", "finished"] },
          }),
        }),
      );
    });

    test("Should use given status when a specific one is provided", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([]);
      await sut.getDeliverymanRankingByPeriod(makeFilter({ status: "finished" }));
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: { in: ["finished"] } }),
        }),
      );
    });

    test("Should filter by visibleUnitIds when scope has visible units", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10, 20] });
      prisma.orderDelivery.findMany.mockResolvedValueOnce([]);
      await sut.getDeliverymanRankingByPeriod(makeFilter({ accountId: 1 }));
      expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            unitStoreId: { in: [10, 20] },
          }),
        }),
      );
    });

    test("Should not filter by unitStoreId when scope has no visible units", async () => {
      const { sut, prisma } = makeSut();
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [] });
      prisma.orderDelivery.findMany.mockResolvedValueOnce([]);
      await sut.getDeliverymanRankingByPeriod(makeFilter({ accountId: 1 }));
      const callArg = prisma.orderDelivery.findMany.mock.calls[0][0];
      expect(callArg.where.unitStoreId).toBeUndefined();
    });

    test("Should skip deliveries without deliverymanId or deliveryman", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([
        { deliverymanId: null, deliveryman: null },
        { deliverymanId: 1, deliveryman: null },
      ]);
      const result = await sut.getDeliverymanRankingByPeriod(makeFilter());
      expect(result.items).toEqual([]);
      expect(result.totalItems).toBe(0);
    });

    test("Should aggregate totals per deliveryman, sort by totalDeliveries desc and name, and paginate", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([
        { deliverymanId: 1, deliveryman: { name: "Bob", lastName: "B" } },
        { deliverymanId: 2, deliveryman: { name: "Alice", lastName: "A" } },
        { deliverymanId: 2, deliveryman: { name: "Alice", lastName: "A" } },
      ]);
      const result = await sut.getDeliverymanRankingByPeriod(makeFilter());
      expect(result.items).toEqual([
        { deliverymanId: 2, deliverymanName: "Alice A", totalDeliveries: 2 },
        { deliverymanId: 1, deliverymanName: "Bob B", totalDeliveries: 1 },
      ]);
      expect(result.totalItems).toBe(2);
      expect(result.totalDeliveries).toBe(3);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(1);
    });

    test("Should sort alphabetically by deliverymanName when totalDeliveries are equal", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([
        { deliverymanId: 2, deliveryman: { name: "Zed", lastName: "" } },
        { deliverymanId: 1, deliveryman: { name: "Anna", lastName: "" } },
      ]);
      const result = await sut.getDeliverymanRankingByPeriod(makeFilter());
      expect(result.items.map((i) => i.deliverymanName)).toEqual([
        "Anna",
        "Zed",
      ]);
    });

    test("Should clamp currentPage to totalPages when requested page is beyond range", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([
        { deliverymanId: 1, deliveryman: { name: "A", lastName: "" } },
      ]);
      const result = await sut.getDeliverymanRankingByPeriod(
        makeFilter({ page: 5, pageSize: 10 }),
      );
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    test("Should slice items according to page and pageSize", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockResolvedValueOnce([
        { deliverymanId: 1, deliveryman: { name: "A", lastName: "" } },
        { deliverymanId: 2, deliveryman: { name: "B", lastName: "" } },
        { deliverymanId: 3, deliveryman: { name: "C", lastName: "" } },
      ]);
      const result = await sut.getDeliverymanRankingByPeriod(
        makeFilter({ page: 2, pageSize: 2 }),
      );
      expect(result.items.length).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    test("Should throw if prisma.orderDelivery.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findMany.mockRejectedValueOnce(new Error());
      await expect(
        sut.getDeliverymanRankingByPeriod(makeFilter()),
      ).rejects.toThrow();
    });
  });

  describe("updateOrder()", () => {
    const makeFakeUpdateInfo = (overrides: Partial<any> = {}) => ({
      quantity: "2",
      amount: 200,
      ...overrides,
    });

    test("Should throw if order does not exist", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce(null);
      await expect(
        sut.updateOrder(1, makeFakeUpdateInfo()),
      ).rejects.toThrow("Pedido nao encontrado");
    });

    test("Should not check scope when info.accountId is not given", async () => {
      const { sut } = makeSut();
      await sut.updateOrder(1, makeFakeUpdateInfo());
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
    });

    test("Should throw if info.accountId is given and existing order's unit is not visible in scope", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: 50,
      });
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10] });
      await expect(
        sut.updateOrder(1, makeFakeUpdateInfo({ accountId: 3 })),
      ).rejects.toThrow("Sem permissao para atualizar entrega dessa loja");
    });

    test("Should proceed when scope allows the unit", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: 10,
      });
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10] });
      const order = await sut.updateOrder(1, makeFakeUpdateInfo({ accountId: 3 }));
      expect(order).toEqual(makeFakeOrder());
    });

    test("Should include finishedAt when status is finished", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateOrder(1, makeFakeUpdateInfo({ status: "finished" }));
      const callArg = prisma.orderDelivery.update.mock.calls[0][0];
      expect(callArg.data.finishedAt).toBeInstanceOf(Date);
      expect(callArg.data.status).toBe("finished");
    });

    test("Should include deliverymanId when given", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateOrder(1, makeFakeUpdateInfo({ deliverymanId: 7 }));
      const callArg = prisma.orderDelivery.update.mock.calls[0][0];
      expect(callArg.data.deliverymanId).toBe(7);
    });

    test("Should not include finishedAt, status or deliverymanId when not given", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateOrder(1, makeFakeUpdateInfo());
      const callArg = prisma.orderDelivery.update.mock.calls[0][0];
      expect(callArg.data.finishedAt).toBeUndefined();
      expect(callArg.data.status).toBeUndefined();
      expect(callArg.data.deliverymanId).toBeUndefined();
    });

    test("Should resolve rootStoreId and emit realtime event when updated order has unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.update.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: 10 }),
      );
      await sut.updateOrder(1, makeFakeUpdateInfo());
      expect(mockedResolveRootStoreId).toHaveBeenCalledWith(prisma, 10);
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith({
        eventType: "updated",
        unitStoreId: 10,
        rootStoreId: 99,
        order: makeFakeOrder({ unitStoreId: 10 }),
      });
    });

    test("Should emit realtime event with null values when updated order has no unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.update.mockResolvedValueOnce(
        makeFakeOrder({ unitStoreId: null }),
      );
      await sut.updateOrder(1, makeFakeUpdateInfo());
      expect(mockedResolveRootStoreId).not.toHaveBeenCalled();
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith(
        expect.objectContaining({ unitStoreId: null, rootStoreId: null }),
      );
    });

    test("Should throw if prisma.orderDelivery.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.update.mockRejectedValueOnce(new Error());
      await expect(
        sut.updateOrder(1, makeFakeUpdateInfo()),
      ).rejects.toThrow();
    });
  });

  describe("deleteById()", () => {
    test("Should throw if order does not exist", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce(null);
      await expect(sut.deleteById(1)).rejects.toThrow("Pedido nao encontrado");
    });

    test("Should not check scope when accountId is not given", async () => {
      const { sut } = makeSut();
      await sut.deleteById(1);
      expect(mockedGetAccountScope).not.toHaveBeenCalled();
    });

    test("Should throw if accountId is given and existing order's unit is not visible in scope", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: 50,
      });
      mockedGetAccountScope.mockResolvedValueOnce({ visibleUnitIds: [10] });
      await expect(sut.deleteById(1, 3)).rejects.toThrow(
        "Sem permissao para deletar entrega dessa loja",
      );
    });

    test("Should call prisma.orderDelivery.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteById(1);
      expect(prisma.orderDelivery.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should resolve rootStoreId and emit realtime event when existing order has unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: 10,
      });
      await sut.deleteById(1);
      expect(mockedResolveRootStoreId).toHaveBeenCalledWith(prisma, 10);
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith({
        eventType: "deleted",
        unitStoreId: 10,
        rootStoreId: 99,
        order: { id: 1 },
      });
    });

    test("Should emit realtime event with null values when existing order has no unitStoreId", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: null,
      });
      await sut.deleteById(1);
      expect(mockedResolveRootStoreId).not.toHaveBeenCalled();
      expect(mockedEmitDeliveryRealtime).toHaveBeenCalledWith(
        expect.objectContaining({ unitStoreId: null, rootStoreId: null }),
      );
    });

    test("Should return success message", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.findUnique.mockResolvedValueOnce({
        id: 1,
        unitStoreId: null,
      });
      const message = await sut.deleteById(1);
      expect(message).toBe("Deletado com Sucesso");
    });

    test("Should throw if prisma.orderDelivery.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.orderDelivery.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteById(1)).rejects.toThrow();
    });
  });
});
