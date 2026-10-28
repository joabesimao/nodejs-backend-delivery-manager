import { DbUpdateOrderDelivery } from "./db--update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../protocols/db/order-delivery/update-order-delivery";
import { LoadOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/load-order-delivery";
import {
  OrderFieldChangeDeniedError,
  OrderStatusTransitionError,
} from "../../../../presentation/errors";

const makeFakeUpdateOrderDelivery = (): UpdateOrderDeliveryModel => ({
  amount: 1,
  quantity: "1",
});

const makeFakeOrderDelivery = (): OrderDeliveryModel => ({
  id: 2,
  status: "actived",
  register: {
    id: 2,
    client: {
      name: "any_name",
      cpf: "any_cpf",
      phone: "any_number",
    },
    address: {
      street: "any_street",
      neighborhood: "any_neighborhood",
      numberHouse: 1,
      reference: "any_reference",
      city: "any_city",
    },
  },
  amount: 2,
  quantity: "2",
  data: new Date("2010-10-10"),
});

interface SutTypes {
  sut: DbUpdateOrderDelivery;
  updateOrderDeliveryRepositoryStub: UpdateOrderDeliveryRepository;
  loadOrderDeliveryByIdRepositoryStub: LoadOrderDeliveryByIdRepository;
}

const makeCurrentOrder = (): OrderDeliveryModel => ({
  ...makeFakeOrderDelivery(),
  amount: 50,
  deliveryman: {
    id: 7,
    name: "any_name",
    lastName: "any_last_name",
    numberQualification: "any_qualification",
    phone: "any_phone",
  },
});

const makeLoadByIdRepositoryStub = (): LoadOrderDeliveryByIdRepository => {
  class LoadOrderDeliveryByIdRepositoryStub
    implements LoadOrderDeliveryByIdRepository {
    async getOneOrderOfDelivery(): Promise<OrderDeliveryModel> {
      return makeCurrentOrder();
    }
  }
  return new LoadOrderDeliveryByIdRepositoryStub();
};

const makeUpdateRepositoryStub = (): UpdateOrderDeliveryRepository => {
  class UpdateOrderDeliveryRepositoryStub
    implements UpdateOrderDeliveryRepository {
    async updateOrder(
      id: number,
      info: UpdateOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return await new Promise((resolve) => resolve(makeFakeOrderDelivery()));
    }
  }
  return new UpdateOrderDeliveryRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateOrderDeliveryRepositoryStub = makeUpdateRepositoryStub();
  const loadOrderDeliveryByIdRepositoryStub = makeLoadByIdRepositoryStub();
  const sut = new DbUpdateOrderDelivery(
    updateOrderDeliveryRepositoryStub,
    loadOrderDeliveryByIdRepositoryStub
  );
  return {
    sut,
    updateOrderDeliveryRepositoryStub,
    loadOrderDeliveryByIdRepositoryStub,
  };
};

describe("DbUpdateOrderDelivery", () => {
  test("Should call UpdateOrderDeliveryRepository", async () => {
    const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(
      updateOrderDeliveryRepositoryStub,
      "updateOrder"
    );
    await sut.update(1, makeFakeUpdateOrderDelivery());
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return one orderDelivery on success", async () => {
    const { sut } = makeSut();

    const registerUpdated = await sut.update(1, makeFakeUpdateOrderDelivery());
    expect(registerUpdated).toEqual(makeFakeOrderDelivery());
  });

  test("Should throw if UpdateOrderDeliveryRepository throws", async () => {
    const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
    jest
      .spyOn(updateOrderDeliveryRepositoryStub, "updateOrder")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(2, makeFakeUpdateOrderDelivery());
    await expect(promise).rejects.toThrow();
  });

  describe("entregador", () => {
    const makeInfo = (
      overrides: Partial<UpdateOrderDeliveryModel> = {}
    ): UpdateOrderDeliveryModel => ({
      quantity: "2",
      amount: 50,
      deliverymanId: 7,
      status: "finished",
      accountId: 3,
      accountRole: "entregador",
      ...overrides,
    });

    test("Should load the current order with the requester scope", async () => {
      const { sut, loadOrderDeliveryByIdRepositoryStub } = makeSut();
      const loadSpy = jest.spyOn(
        loadOrderDeliveryByIdRepositoryStub,
        "getOneOrderOfDelivery"
      );
      await sut.update(2, makeInfo());
      expect(loadSpy).toHaveBeenCalledWith(2, 3);
    });

    test("Should allow finishing when amount and deliveryman are unchanged", async () => {
      const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
      const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
      await sut.update(2, makeInfo());
      expect(updateSpy).toHaveBeenCalledWith(2, makeInfo());
    });

    test("Should throw OrderFieldChangeDeniedError if the amount changes", async () => {
      const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
      const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
      await expect(sut.update(2, makeInfo({ amount: 1 }))).rejects.toThrow(
        OrderFieldChangeDeniedError
      );
      expect(updateSpy).not.toHaveBeenCalled();
    });

    test("Should throw OrderFieldChangeDeniedError if the deliveryman changes", async () => {
      const { sut } = makeSut();
      await expect(sut.update(2, makeInfo({ deliverymanId: 8 }))).rejects.toThrow(
        OrderFieldChangeDeniedError
      );
    });

    test("Should throw OrderFieldChangeDeniedError when assigning a deliveryman to an order without one", async () => {
      const { sut, loadOrderDeliveryByIdRepositoryStub } = makeSut();
      jest
        .spyOn(loadOrderDeliveryByIdRepositoryStub, "getOneOrderOfDelivery")
        .mockResolvedValueOnce({ ...makeCurrentOrder(), deliveryman: undefined });
      await expect(sut.update(2, makeInfo({ deliverymanId: 7 }))).rejects.toThrow(
        OrderFieldChangeDeniedError
      );
    });

    test("Should allow a status-only update", async () => {
      const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
      const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
      const info = makeInfo({ amount: undefined, deliverymanId: undefined });
      await sut.update(2, info);
      expect(updateSpy).toHaveBeenCalledWith(2, info);
    });
  });

  test("Should allow other roles to change amount and deliveryman", async () => {
    const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
    const info: UpdateOrderDeliveryModel = {
      amount: 1,
      quantity: "1",
      deliverymanId: 8,
      accountRole: "user",
    };
    await sut.update(2, info);
    expect(updateSpy).toHaveBeenCalledWith(2, info);
  });

  describe("status transitions", () => {
    const mockCurrentStatus = (
      stub: LoadOrderDeliveryByIdRepository,
      status: OrderDeliveryModel["status"]
    ): void => {
      jest
        .spyOn(stub, "getOneOrderOfDelivery")
        .mockResolvedValueOnce({ ...makeCurrentOrder(), status });
    };

    test.each([
      ["actived", "delivered"],
      ["actived", "finished"],
      ["delivered", "finished"],
      ["delivered", "delivered"],
    ] as const)("Should allow %s -> %s", async (from, to) => {
      const { sut, loadOrderDeliveryByIdRepositoryStub, updateOrderDeliveryRepositoryStub } = makeSut();
      mockCurrentStatus(loadOrderDeliveryByIdRepositoryStub, from);
      const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
      await sut.update(2, { status: to, accountRole: "admin" });
      expect(updateSpy).toHaveBeenCalled();
    });

    test.each([
      ["delivered", "actived"],
      ["finished", "actived"],
      ["finished", "delivered"],
      ["finished", "finished"],
      ["finished", undefined],
    ] as const)("Should reject %s -> %s", async (from, to) => {
      const { sut, loadOrderDeliveryByIdRepositoryStub, updateOrderDeliveryRepositoryStub } = makeSut();
      mockCurrentStatus(loadOrderDeliveryByIdRepositoryStub, from);
      const updateSpy = jest.spyOn(updateOrderDeliveryRepositoryStub, "updateOrder");
      await expect(
        sut.update(2, { status: to, quantity: "3", accountRole: "admin" })
      ).rejects.toThrow(OrderStatusTransitionError);
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});
