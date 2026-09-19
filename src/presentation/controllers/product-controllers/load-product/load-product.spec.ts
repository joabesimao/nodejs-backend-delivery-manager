import { LoadAllProduct } from "../../../../domain/usescases/product/load-product/load-product";
import {
  LoadProductFilter,
  LoadProductResult,
  Product,
} from "../../../../domain/models/product/product";
import { LoadProductController } from "./load-product";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors";

const makeFakeProducts = (): Product[] => [
  {
    id: 1,
    name: "any_name",
    price: 10,
    description: "any_description",
    category: "any_category",
    status: true,
  },
];

const makeFakeResult = (): LoadProductResult => ({
  items: makeFakeProducts(),
  total: 1,
});

const makeLoadAllProductStub = (): LoadAllProduct => {
  class LoadAllProductStub implements LoadAllProduct {
    async load(filter?: LoadProductFilter): Promise<LoadProductResult> {
      return new Promise((resolve) => resolve(makeFakeResult()));
    }
  }
  return new LoadAllProductStub();
};

interface SutTypes {
  sut: LoadProductController;
  loadProductStub: LoadAllProduct;
}

const makeSut = (): SutTypes => {
  const loadProductStub = makeLoadAllProductStub();
  const sut = new LoadProductController(loadProductStub);
  return {
    sut,
    loadProductStub,
  };
};

describe("LoadProduct Controller", () => {
  test("Should call LoadAllProduct with parsed query params", async () => {
    const { sut, loadProductStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductStub, "load");
    const httpRequest: HttpRequest = {
      query: {
        name: "prod",
        category: "cat",
        priceMin: "10",
        priceMax: "20",
        limit: "5",
        offset: "0",
      },
    };
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith({
      name: "prod",
      category: "cat",
      priceMin: 10,
      priceMax: 20,
      limit: 5,
      offset: 0,
    });
  });

  test("Should default limit and offset when omitted", async () => {
    const { sut, loadProductStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductStub, "load");
    await sut.handle({ query: {} });
    expect(loadSpy).toHaveBeenCalledWith({
      name: undefined,
      category: undefined,
      priceMin: undefined,
      priceMax: undefined,
      limit: 50,
      offset: 0,
    });
  });

  test("Should return 200 with items and pagination on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ query: {} });
    expect(httpResponse).toEqual(
      ok({
        items: makeFakeProducts(),
        pagination: { total: 1, limit: 50, offset: 0, hasMore: false },
      })
    );
  });

  test("Should return 400 if priceMin is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { priceMin: "not_a_number" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("priceMin")));
  });

  test("Should return 400 if priceMin is negative", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { priceMin: "-1" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("priceMin")));
  });

  test("Should return 400 if priceMax is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { priceMax: "not_a_number" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("priceMax")));
  });

  test("Should return 400 if priceMax is negative", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { priceMax: "-1" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("priceMax")));
  });

  test("Should return 400 if priceMin is greater than priceMax", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      query: { priceMin: "20", priceMax: "10" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("priceMin")));
  });

  test("Should return 400 if limit is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ query: { limit: "-1" } });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("limit")));
  });

  test("Should return 400 if offset is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ query: { offset: "not_a_number" } });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("offset")));
  });

  test("Should return 400 if offset is negative", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ query: { offset: "-1" } });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("offset")));
  });

  test("Should return 500 if LoadAllProduct throws", async () => {
    const { sut, loadProductStub } = makeSut();
    jest
      .spyOn(loadProductStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle({ query: {} });
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
