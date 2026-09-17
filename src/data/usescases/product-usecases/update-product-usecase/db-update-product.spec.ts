import { DbUpdateProduct } from "./db-update-product";
import { UpdateProductRepository } from "../../../protocols/db/product/update-product-repository";
import { Product, ProductModel } from "../../../../domain/models/product/product";

const makeFakeProduct = (): Product => ({
  id: 1,
  name: "any_name",
  price: 10,
  description: "any_description",
  category: "any_category",
  status: true,
});

const makeFakeUpdateInfo = (): Partial<ProductModel> => ({
  name: "new_name",
  status: false,
  variations: [{ attribute: "Cor", value: "Azul" }],
});

interface SutTypes {
  sut: DbUpdateProduct;
  updateProductRepositoryStub: UpdateProductRepository;
}

const makeUpdateProductRepository = (): UpdateProductRepository => {
  class UpdateProductRepositoryStub implements UpdateProductRepository {
    async updateProduct(id: number, info: Partial<ProductModel>): Promise<Product> {
      return new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new UpdateProductRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateProductRepositoryStub = makeUpdateProductRepository();
  const sut = new DbUpdateProduct(updateProductRepositoryStub);
  return {
    sut,
    updateProductRepositoryStub,
  };
};

describe("DbUpdateProduct", () => {
  const id = 1;

  test("Should call UpdateProductRepository with correct values", async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateProductRepositoryStub, "updateProduct");
    await sut.update(id, makeFakeUpdateInfo());
    expect(updateSpy).toHaveBeenCalledWith(id, makeFakeUpdateInfo());
  });

  test("Should return the updated product on success", async () => {
    const { sut } = makeSut();
    const product = await sut.update(id, makeFakeUpdateInfo());
    expect(product).toEqual(makeFakeProduct());
  });

  test("Should throw if UpdateProductRepository throws", async () => {
    const { sut, updateProductRepositoryStub } = makeSut();
    jest
      .spyOn(updateProductRepositoryStub, "updateProduct")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, makeFakeUpdateInfo());
    await expect(promise).rejects.toThrow();
  });
});
