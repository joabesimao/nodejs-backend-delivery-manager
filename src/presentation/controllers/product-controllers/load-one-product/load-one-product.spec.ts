import { LoadProductById } from "../../../../domain/usescases/product/load-product/load-product";
import { Product } from "../../../../domain/models/product/product";
import { LoadOneProductController } from "./load-one-product";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";

const makeFakeProduct = (): Product => ({
  id: 1,
  name: "any_name",
  price: 10,
  description: "any_description",
  category: "any_category",
  status: true,
});

const fakeHttpRequest = (): HttpRequest => ({
  params: {
    id: 1,
  },
});

const makeLoadProductByIdStub = (): LoadProductById => {
  class LoadProductByIdStub implements LoadProductById {
    async loadOne(id: number): Promise<Product> {
      return await new Promise((resolve) => resolve(makeFakeProduct()));
    }
  }
  return new LoadProductByIdStub();
};

interface SutTypes {
  sut: LoadOneProductController;
  loadProductStub: LoadProductById;
}

const makeSut = (): SutTypes => {
  const loadProductStub = makeLoadProductByIdStub();
  const sut = new LoadOneProductController(loadProductStub);
  return {
    sut,
    loadProductStub,
  };
};

describe("LoadOneProduct Controller", () => {
  test("Should call LoadProductById with correct value", async () => {
    const { sut, loadProductStub } = makeSut();
    const loadSpy = jest.spyOn(loadProductStub, "loadOne");
    await sut.handle(fakeHttpRequest());
    expect(loadSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 200 with product on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(fakeHttpRequest());
    expect(httpResponse).toEqual(ok(makeFakeProduct()));
  });

  test("Should return 500 if LoadProductById throws", async () => {
    const { sut, loadProductStub } = makeSut();
    jest
      .spyOn(loadProductStub, "loadOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(fakeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
