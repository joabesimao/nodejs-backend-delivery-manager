import { LoadOrderDeliveryRankingController } from "./load-order-delivery-ranking";
import { LoadOrderDeliveryRanking } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import {
  DeliveryRankingFilter,
  DeliveryRankingPaginatedModel,
} from "../../../../domain/models/order-delivery/delivery-ranking";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";

interface SutTypes {
  sut: LoadOrderDeliveryRankingController;
  loadOrderDeliveryRankingStub: LoadOrderDeliveryRanking;
}

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

const makeLoadOrderDeliveryRankingStub = (): LoadOrderDeliveryRanking => {
  class LoadOrderDeliveryRankingStub implements LoadOrderDeliveryRanking {
    async loadByPeriod(
      filter: DeliveryRankingFilter
    ): Promise<DeliveryRankingPaginatedModel> {
      return new Promise((resolve) => resolve(makeFakeRanking()));
    }
  }
  return new LoadOrderDeliveryRankingStub();
};

const makeSut = (): SutTypes => {
  const loadOrderDeliveryRankingStub = makeLoadOrderDeliveryRankingStub();
  const sut = new LoadOrderDeliveryRankingController(
    loadOrderDeliveryRankingStub
  );
  return {
    sut,
    loadOrderDeliveryRankingStub,
  };
};

const makeFakeRequest = (query: Record<string, unknown> = {}): HttpRequest => ({
  query: {
    startDate: "2022-10-10",
    endDate: "2022-10-20",
    ...query,
  },
});

describe("LoadOrderDeliveryRanking Controller", () => {
  test("Should call LoadOrderDeliveryRanking with correct values", async () => {
    const { sut, loadOrderDeliveryRankingStub } = makeSut();
    const loadSpy = jest.spyOn(loadOrderDeliveryRankingStub, "loadByPeriod");
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith({
      startDate: new Date("2022-10-10"),
      endDate: new Date("2022-10-20"),
      status: "all",
      page: 1,
      pageSize: 10,
      accountId: undefined,
    });
  });

  test("Should return 200 with the ranking on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeRanking()));
  });

  test("Should return 400 if startDate is missing", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { endDate: "2022-10-20" },
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if endDate is missing", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { startDate: "2022-10-10" },
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if startDate is an invalid date", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(
      makeFakeRequest({ startDate: "not_a_date" })
    );
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if endDate is an invalid date", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(
      makeFakeRequest({ endDate: "not_a_date" })
    );
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if startDate is greater than endDate", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(
      makeFakeRequest({ startDate: "2022-10-30", endDate: "2022-10-20" })
    );
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if status is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(
      makeFakeRequest({ status: "invalid_status" })
    );
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if page is not an integer or is less than 1", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest({ page: 0 }));
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 400 if pageSize is not an integer, less than 1 or greater than 100", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(
      makeFakeRequest({ pageSize: 101 })
    );
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 500 if LoadOrderDeliveryRanking throws", async () => {
    const { sut, loadOrderDeliveryRankingStub } = makeSut();
    jest
      .spyOn(loadOrderDeliveryRankingStub, "loadByPeriod")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
