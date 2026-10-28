import { DbDeleteProduct } from "./db-delete-product";
import { DeleteProductByIdRepository } from "../../../protocols/db/product/delete-product-repository";

interface SutTypes {
  sut: DbDeleteProduct;
  deleteProductRepositoryStub: DeleteProductByIdRepository;
}

const makeDeleteProductRepository = (): DeleteProductByIdRepository => {
  class DeleteProductByIdRepositoryStub implements DeleteProductByIdRepository {
    async deleteById(id: number): Promise<string> {
      return await new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteProductByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteProductRepositoryStub = makeDeleteProductRepository();
  const sut = new DbDeleteProduct(deleteProductRepositoryStub);
  return {
    sut,
    deleteProductRepositoryStub,
  };
};

describe("DbDeleteProduct", () => {
  const id = 1;

  test("Should call DeleteProductByIdRepository with correct id", async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductRepositoryStub, "deleteById");
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalledWith(id);
  });

  test("Should return a success message on success", async () => {
    const { sut } = makeSut();
    const result = await sut.delete(id);
    expect(result).toBe("Deletado com sucesso!");
  });

  test("Should throw if DeleteProductByIdRepository throws", async () => {
    const { sut, deleteProductRepositoryStub } = makeSut();
    jest
      .spyOn(deleteProductRepositoryStub, "deleteById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });
});
