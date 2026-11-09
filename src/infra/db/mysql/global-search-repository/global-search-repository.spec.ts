import { GlobalSearchMysqlRepository } from "./global-search-repository";

const contains = { contains: "ana", mode: "insensitive" };

const makeFakePrisma = () => ({
  orderDelivery: { findMany: jest.fn().mockResolvedValue([]) },
  client: { findMany: jest.fn().mockResolvedValue([]) },
  deliveryman: { findMany: jest.fn().mockResolvedValue([]) },
});

const makeSut = () => {
  const prisma = makeFakePrisma();
  return { sut: new GlobalSearchMysqlRepository(prisma as never), prisma };
};

describe("GlobalSearch MySql Repository", () => {
  test("searchOrders() searches by client and deliveryman names", async () => {
    const { sut, prisma } = makeSut();
    prisma.orderDelivery.findMany.mockResolvedValueOnce([
      { id: 1, status: "finished", amount: 50, Register: { client: { name: "Ana" } }, deliveryman: null },
      { id: 2, status: "actived", amount: 30, Register: null, deliveryman: { name: "João", lastName: "Silva" } },
    ]);
    const orders = await sut.searchOrders("ana", undefined, 5);
    expect(prisma.orderDelivery.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { Register: { client: { name: contains } } },
          { deliveryman: { name: contains } },
          { deliveryman: { lastName: contains } },
        ],
      },
      include: { deliveryman: true, Register: { include: { client: true, address: true } } },
      orderBy: { data: "desc" },
      take: 5,
    });
    expect(orders).toEqual([
      { id: 1, status: "finished", amount: 50, clientName: "Ana", deliveryman: null },
      { id: 2, status: "actived", amount: 30, clientName: null, deliveryman: { name: "João", lastName: "Silva" } },
    ]);
  });

  test("searchOrders() adds the order id first when given", async () => {
    const { sut, prisma } = makeSut();
    await sut.searchOrders("42", 42, 5);
    const [args] = prisma.orderDelivery.findMany.mock.calls[0];
    expect(args.where.OR[0]).toEqual({ id: 42 });
  });

  test("searchClients() searches name, cpf and phone and maps public fields", async () => {
    const { sut, prisma } = makeSut();
    prisma.client.findMany.mockResolvedValueOnce([{ id: 1, name: "Ana", cpf: "123", phone: "999", status: true }]);
    const clients = await sut.searchClients("ana", 5);
    expect(prisma.client.findMany).toHaveBeenCalledWith({
      where: { OR: [{ name: contains }, { cpf: contains }, { phone: contains }] },
      take: 5,
    });
    expect(clients).toEqual([{ id: 1, name: "Ana", cpf: "123", phone: "999" }]);
  });

  test("searchDeliverymen() searches name, last name and phone and maps public fields", async () => {
    const { sut, prisma } = makeSut();
    prisma.deliveryman.findMany.mockResolvedValueOnce([
      { id: 1, name: "João", lastName: "Silva", phone: "888", cpf: "321" },
    ]);
    const deliverymen = await sut.searchDeliverymen("ana", 5);
    expect(prisma.deliveryman.findMany).toHaveBeenCalledWith({
      where: { OR: [{ name: contains }, { lastName: contains }, { phone: contains }] },
      take: 5,
    });
    expect(deliverymen).toEqual([{ id: 1, name: "João", lastName: "Silva", phone: "888" }]);
  });
});
