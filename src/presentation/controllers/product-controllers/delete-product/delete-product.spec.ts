import { DeleteProductById } from "../../../../domain/usescases/product/delete-product/delete-product";
import { DeleteProductController } from "./delete-product";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";

const fakeHttpRequest = (): HttpRequest => ({
  params: {
    id: 1,
  },
});

const makeDeleteProductStub = (): DeleteProductById => {
  class DeleteProductStub implements DeleteProductById {
    async delete(id: number): Promise<string> {
      return await new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteProductStub();
};

interface SutTypes {
  sut: DeleteProductController;
  deleteProductStub: DeleteProductById;
}

const makeSut = (): SutTypes => {
  const deleteProductStub = makeDeleteProductStub();
  const sut = new DeleteProductController(deleteProductStub);
  return {
    sut,
    deleteProductStub,
  };
};

describe("DeleteProduct Controller", () => {
  test("Should call DeleteProductById with correct value", async () => {
    const { sut, deleteProductStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteProductStub, "delete");
    await sut.handle(fakeHttpRequest());
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(fakeHttpRequest());
    expect(httpResponse).toEqual(ok("Deletado com sucesso!"));
  });

  test("Should return 500 if DeleteProductById throws", async () => {
    const { sut, deleteProductStub } = makeSut();
    jest
      .spyOn(deleteProductStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(fakeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
