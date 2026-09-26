import { DbLoadAllProduct } from "./load-product-usecase";
import { LoadProductRepository } from "../../../protocols/db/product/load-product-repository";
import {
  LoadProductFilter,
  LoadProductResult,
  Product,
} from "../../../../domain/models/product/product";

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

interface SutTypes {
  sut: DbLoadAllProduct;
  loadProductRepositoryStub: LoadProductRepository;
}

const makeLoadProductRepository = (): LoadProductRepository => {
  class LoadProductRepositoryStub implements LoadProductRepository {
    async getAllProducts(filter?: LoadProductFilter): Promise<LoadProductResult> {
      return await new Promise((resolve) => resolve(makeFakeResult()));
    }
  }
  return new LoadProductRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadProductRepositoryStub = makeLoadProductRepository();
  const sut = new DbLoadAllProduct(loadProductRepositoryStub);
  return {
    sut,
    loadProductRepositoryStub,
  };
};

describe("DbLoadAllProduct", () => {
  test("Should call LoadProductRepository without a filter", async () => {
    const { sut, loadProductRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductRepositoryStub, "getAllProducts");
    await sut.load();
    expect(loadSpy).toHaveBeenCalledWith(undefined);
  });

  test("Should call LoadProductRepository with the given filter", async () => {
    const { sut, loadProductRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductRepositoryStub, "getAllProducts");
    const filter: LoadProductFilter = { name: "any_name", limit: 10, offset: 0 };
    await sut.load(filter);
    expect(loadSpy).toHaveBeenCalledWith(filter);
  });

  test("Should return items and total on success", async () => {
    const { sut } = makeSut();
    const result = await sut.load();
    expect(result).toEqual(makeFakeResult());
  });

  test("Should throw if LoadProductRepository throws", async () => {
    const { sut, loadProductRepositoryStub } = makeSut();
    jest
      .spyOn(loadProductRepositoryStub, "getAllProducts")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });
});
