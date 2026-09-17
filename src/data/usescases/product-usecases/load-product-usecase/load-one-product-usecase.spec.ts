import { DbLoadOneProduct } from "./load-one-product-usecase";
import { LoadProductByIdRepository } from "../../../protocols/db/product/load-product-repository";
import { Product } from "../../../../domain/models/product/product";

const makeFakeProduct = (): Product => ({
  id: 1,
  name: "any_name",
  price: 10,
  description: "any_description",
  category: "any_category",
  status: true,
});

interface SutTypes {
  sut: DbLoadOneProduct;
  loadProductByIdRepositoryStub: LoadProductByIdRepository;
}

const makeLoadProductByIdRepository = (): LoadProductByIdRepository => {
  class LoadProductByIdRepositoryStub implements LoadProductByIdRepository {
    async getOneProduct(id: number): Promise<Product> {
      return new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new LoadProductByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadProductByIdRepositoryStub = makeLoadProductByIdRepository();
  const sut = new DbLoadOneProduct(loadProductByIdRepositoryStub);
  return {
    sut,
    loadProductByIdRepositoryStub,
  };
};

describe("DbLoadOneProduct", () => {
  const id = 1;

  test("Should call LoadProductByIdRepository with correct id", async () => {
    const { sut, loadProductByIdRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductByIdRepositoryStub, "getOneProduct");
    await sut.loadOne(id);
    expect(loadSpy).toHaveBeenCalledWith(id);
  });

  test("Should return a product on success", async () => {
    const { sut } = makeSut();
    const product = await sut.loadOne(id);
    expect(product).toEqual(makeFakeProduct());
  });

  test("Should throw if LoadProductByIdRepository throws", async () => {
    const { sut, loadProductByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadProductByIdRepositoryStub, "getOneProduct")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadOne(id);
    await expect(promise).rejects.toThrow();
  });
});
