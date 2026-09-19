import { DbLoadOrderDeliveryRanking } from "./db-load-order-delivery-ranking";
import { LoadOrderDeliveryRankingRepository } from "../../../protocols/db/order-delivery/load-order-delivery";
import {
  DeliveryRankingFilter,
  DeliveryRankingPaginatedModel,
} from "../../../../domain/models/order-delivery/delivery-ranking";

interface SutTypes {
  sut: DbLoadOrderDeliveryRanking;
  loadOrderDeliveryRankingRepositoryStub: LoadOrderDeliveryRankingRepository;
}

const makeFakeFilter = (): DeliveryRankingFilter => ({
  startDate: new Date("2022-10-10"),
  endDate: new Date("2022-10-20"),
  status: "all",
  page: 1,
  pageSize: 10,
});

const makeFakeRanking = (): DeliveryRankingPaginatedModel => ({
  items: [
    {
      deliverymanId: 1,
      deliverymanName: "any_name",
      totalDeliveries: 10,
    },
  ],
  page: 1,
  pageSize: 10,
  totalItems: 1,
  totalPages: 1,
  totalDeliveries: 10,
});

const makeLoadOrderDeliveryRankingRepositoryStub =
  (): LoadOrderDeliveryRankingRepository => {
    class LoadOrderDeliveryRankingRepositoryStub
      implements LoadOrderDeliveryRankingRepository
    {
      async getDeliverymanRankingByPeriod(
        filter: DeliveryRankingFilter
      ): Promise<DeliveryRankingPaginatedModel> {
        return new Promise((resolve) => resolve(makeFakeRanking()));
      }
    }
    return new LoadOrderDeliveryRankingRepositoryStub();
  };

const makeSut = (): SutTypes => {
  const loadOrderDeliveryRankingRepositoryStub =
    makeLoadOrderDeliveryRankingRepositoryStub();
  const sut = new DbLoadOrderDeliveryRanking(
    loadOrderDeliveryRankingRepositoryStub
  );
  return {
    sut,
    loadOrderDeliveryRankingRepositoryStub,
  };
};

describe("DbLoadOrderDeliveryRanking Usecase", () => {
  test("Should call LoadOrderDeliveryRankingRepository with correct values", async () => {
    const { sut, loadOrderDeliveryRankingRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadOrderDeliveryRankingRepositoryStub,
      "getDeliverymanRankingByPeriod"
    );
    const filter = makeFakeFilter();
    await sut.loadByPeriod(filter);
    expect(loadSpy).toHaveBeenCalledWith(filter);
  });

  test("Should return a ranking on success", async () => {
    const { sut } = makeSut();
    const ranking = await sut.loadByPeriod(makeFakeFilter());
    expect(ranking).toEqual(makeFakeRanking());
  });

  test("Should throw if LoadOrderDeliveryRankingRepository throws", async () => {
    const { sut, loadOrderDeliveryRankingRepositoryStub } = makeSut();
    jest
      .spyOn(
        loadOrderDeliveryRankingRepositoryStub,
        "getDeliverymanRankingByPeriod"
      )
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadByPeriod(makeFakeFilter());
    await expect(promise).rejects.toThrow();
  });
});
