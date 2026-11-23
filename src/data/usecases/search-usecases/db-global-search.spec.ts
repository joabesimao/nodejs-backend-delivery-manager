import { DbGlobalSearch } from "./db-global-search";

const makeSut = () => {
  const repository = {
    searchOrders: jest.fn().mockResolvedValue([
      { id: 1, status: "finished", amount: 50, clientName: "Ana", deliveryman: { name: "João", lastName: "Silva" } },
      { id: 2, status: "actived", amount: 30, clientName: null, deliveryman: null },
    ]),
    searchClients: jest.fn().mockResolvedValue([{ id: 1, name: "Ana", cpf: "123", phone: "999" }]),
    searchDeliverymen: jest.fn().mockResolvedValue([{ id: 1, name: "João", lastName: "Silva", phone: "888" }]),
  };
  return { sut: new DbGlobalSearch(repository), repository };
};

describe("DbGlobalSearch", () => {
  test("Should return empty results for terms shorter than 2 characters", async () => {
    const { sut, repository } = makeSut();
    expect(await sut.search("a")).toEqual({ query: "a", orders: [], clients: [], deliverymen: [] });
    expect(repository.searchOrders).not.toHaveBeenCalled();
  });

  test("Should search with a limit of 5 and an order id only for numeric terms", async () => {
    const { sut, repository } = makeSut();
    await sut.search("ana");
    expect(repository.searchOrders).toHaveBeenLastCalledWith("ana", undefined, 5);
    expect(repository.searchClients).toHaveBeenCalledWith("ana", 5);
    expect(repository.searchDeliverymen).toHaveBeenCalledWith("ana", 5);
    await sut.search("42");
    expect(repository.searchOrders).toHaveBeenLastCalledWith("42", 42, 5);
  });

  test("Should map the order names", async () => {
    const { sut } = makeSut();
    const result = await sut.search("ana");
    expect(result.orders).toEqual([
      { id: 1, status: "finished", amount: 50, clientName: "Ana", deliverymanName: "João Silva" },
      { id: 2, status: "actived", amount: 30, clientName: "", deliverymanName: null },
    ]);
    expect(result.clients).toEqual([{ id: 1, name: "Ana", cpf: "123", phone: "999" }]);
    expect(result.deliverymen).toEqual([{ id: 1, name: "João", lastName: "Silva", phone: "888" }]);
  });
});
