import { DbAddProduct } from "./add-product";
import { AddProductRepository } from "../../../protocols/db/product/add-product-repository";
import { AddProductModel } from "../../../../domain/usescases/product/add-product/add-product";
import { Product } from "../../../../domain/models/product/product";

const makeFakeProductModel = (): AddProductModel => ({
  name: "any_name",
  price: 10,
  description: "any_description",
  category: "any_category",
  subcategory: "any_subcategory",
  brand: "any_brand",
  model: "any_model",
  unit: "un.",
  barcode: "any_barcode",
  status: true,
  notes: "any_notes",
  variations: [{ attribute: "Tamanho", value: "M" }],
});

const makeFakeProduct = (): Product => ({
  id: 1,
  ...makeFakeProductModel(),
  status: true,
});

interface SutTypes {
  sut: DbAddProduct;
  addProductRepositoryStub: AddProductRepository;
}

const makeAddProductRepository = (): AddProductRepository => {
  class AddProductRepositoryStub implements AddProductRepository {
    async add(dataInfo: AddProductModel): Promise<Product> {
      return await new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new AddProductRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addProductRepositoryStub = makeAddProductRepository();
  const sut = new DbAddProduct(addProductRepositoryStub);
  return {
    sut,
    addProductRepositoryStub,
  };
};

describe("DbAddProduct", () => {
  test("Should call AddProductRepository with correct values", async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addProductRepositoryStub, "add");
    await sut.add(makeFakeProductModel());
    expect(addSpy).toHaveBeenCalledWith(makeFakeProductModel());
  });

  test("Should return a product on success", async () => {
    const { sut } = makeSut();
    const product = await sut.add(makeFakeProductModel());
    expect(product).toEqual(makeFakeProduct());
  });

  test("Should throw if AddProductRepository throws", async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    jest
      .spyOn(addProductRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeFakeProductModel());
    await expect(promise).rejects.toThrow();
  });
});
